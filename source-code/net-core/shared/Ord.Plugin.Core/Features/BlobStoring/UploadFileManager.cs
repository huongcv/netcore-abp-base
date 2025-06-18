using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Ord.Domain.Entities.Auth;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Base;
using Volo.Abp.BlobStoring;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class UploadFileManager : OrdManagerBase, IUploadFileManager
    {
        private IBlobContainerManager BlobManager => AppFactory.GetServiceDependency<IBlobContainerManager>();
        private IRepository<FileUploadEntity, Guid> Repository => AppFactory.GetServiceDependency<IRepository<FileUploadEntity, Guid>>();
        private ILogger<UploadFileManager> _logger => AppFactory.GetServiceDependency<ILogger<UploadFileManager>>();
        public async Task<FileUploadDto> GetByFileIdAsync(Guid fileId)
        {
            var fileEntity = await Repository.GetAsync(fileId);
            if (fileEntity == null)
            {
                return null;
            }

            var result = new FileUploadDto
            {
                Id = fileEntity.Id,
                FileName = fileEntity.FileName,
                MimeType = fileEntity.MimeType
            };
            // Lấy bytes từ blob storage nếu cần
            if (!string.IsNullOrEmpty(fileEntity.BlobContainerPath))
            {
                try
                {
                    result.Bytes = await BlobManager.GetAllBytesOrNullAsync(fileEntity.FileStoreProvider, fileEntity.FileName);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error retrieving blob for file ID: {fileId}");
                }
            }

            return result;
        }

        public async Task<FileUploadDto> UploadFileAsync(FileStoreProvider storeProvider, IFormFile file, string blobContainerPath)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty or null");
            }

            _logger.LogInformation($"Uploading file: {file.FileName}, Size: {file.Length} bytes");

            // Đọc file thành byte array
            byte[] fileBytes;
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                fileBytes = memoryStream.ToArray();
            }

            var mimeType = file.ContentType ?? file.FileName.GetMimeType();

            return await UploadFileAsync(storeProvider, fileBytes, file.FileName, mimeType, blobContainerPath);
        }

        public async Task<FileUploadDto> UploadFileAsync(
            FileStoreProvider storeProvider,
            byte[] fileByte,
            string fileName,
            string mimeType,
            string blobContainerPath)
        {
            if (fileByte == null || fileByte.Length == 0)
            {
                throw new ArgumentException("File bytes is empty or null");
            }

            if (string.IsNullOrWhiteSpace(fileName))
            {
                throw new ArgumentException("File name is required");
            }

            _logger.LogInformation($"Uploading file: {fileName}, Size: {fileByte.Length} bytes");

            var fileId = Guid.NewGuid();
            var fileExtension = Path.GetExtension(fileName);
            var blobPath = Path.Combine(blobContainerPath, $"{fileId}{fileExtension}").Replace('\\', '/');

            try
            {
                // Lưu file vào blob storage
                await BlobManager.SaveAsync(storeProvider, blobPath, fileByte, overrideExisting: true);

                // Tạo entity để lưu thông tin file
                var fileEntity = new FileUploadEntity
                {
                    Id = fileId,
                    FileName = fileName,
                    MimeType = mimeType ?? fileName.GetMimeType(),
                    FileSize = fileByte.Length,
                    BlobPath = blobPath,
                    StoreProvider = storeProvider,
                    UploadedAt = DateTime.UtcNow
                };

                // Lưu vào database
                await Repository.InsertAsync(fileEntity, autoSave: true);

                _logger.LogInformation($"File uploaded successfully: {fileName} with ID: {fileId}");

                return new FileUploadDto
                {
                    Id = fileId,
                    FileName = fileName,
                    MimeType = fileEntity.MimeType,
                    Bytes = fileByte // Trả về bytes cho client nếu cần
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading file: {fileName}");

                // Cleanup: Xóa blob nếu đã lưu thành công nhưng lưu DB thất bại
                try
                {
                    if (await BlobContainer.ExistsAsync(blobPath))
                    {
                        await BlobContainer.DeleteAsync(blobPath);
                    }
                }
                catch (Exception cleanupEx)
                {
                    _logger.LogError(cleanupEx, $"Error during cleanup for file: {fileName}");
                }

                throw;
            }
        }

        public async Task RemoveFileAsync(Guid fileId)
        {
            var fileEntity = await Repository.GetAsync(fileId);
            if (fileEntity != null)
            {
                await BlobManager.DeleteAsync(fileEntity.FileStoreProvider, fileEntity.BlobContainerPath);
                await Repository.DeleteAsync(fileEntity);
            }
        }
    }
}
