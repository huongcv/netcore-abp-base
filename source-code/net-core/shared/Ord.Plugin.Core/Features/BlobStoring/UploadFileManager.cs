using Microsoft.AspNetCore.Http;
using Ord.Domain.Entities.Auth;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Core.Base;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class UploadFileManager : OrdManagerBase, IUploadFileManager
    {
        private IRepository<FileUploadEntity, Guid> Repository => AppFactory.GetServiceDependency<IRepository<FileUploadEntity, Guid>>();
        public async Task<FileUploadDto> GetByFileIdAsync(Guid fileId)
        {
            var fileEntity = await Repository.GetAsync(fileId);
            if (fileEntity == null)
            {
                return null;
            }

            throw new NotImplementedException();
        }

        public Task<FileUploadDto> UploadFileAsync(FileStoreProvider storeProvider, IFormFile file, string blobContainerPath)
        {
            throw new NotImplementedException();
        }

        public Task<FileUploadDto> UploadFileAsync(FileStoreProvider storeProvider, byte[] fileByte, string fileName, string mimeType,
            string blobContainerPath)
        {
            throw new NotImplementedException();
        }

        public Task RemoveFileAsync(Guid fileId)
        {
            throw new NotImplementedException();
        }
    }
}
