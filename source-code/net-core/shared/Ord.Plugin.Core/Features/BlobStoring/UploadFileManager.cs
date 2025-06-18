using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Ord.Domain.Entities.Auth;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Core.Base;
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
                throw new ArgumentException("File is empty or null", nameof(file));
            }

            var fileName = file.FileName;
            var blobPath = Path.Combine(blobContainerPath, fileName);

            _logger.LogInformation("Uploading file: {FileName}, Size: {Size} bytes", fileName, file.Length);

            try
            {
                await using var fileStream = file.OpenReadStream();
                // Lưu file vào blob storage
                await BlobManager.SaveAsync(storeProvider, blobPath, fileStream, overrideExisting: true);

                // Tạo entity để lưu thông tin file
                var fileEntity = new FileUploadEntity
                {
                    FileName = fileName,
                    MimeType = file.ContentType,
                    BlobContainerPath = blobPath
                };

                // Lưu vào database
                await Repository.InsertAsync(fileEntity, autoSave: true);

                _logger.LogInformation("File uploaded successfully: {FileName} with ID: {FileId}", fileName, fileEntity.Id);

                return new FileUploadDto
                {
                    Id = fileEntity.Id,
                    FileName = fileEntity.FileName,
                    MimeType = fileEntity.MimeType
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file: {FileName}", fileName);
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
