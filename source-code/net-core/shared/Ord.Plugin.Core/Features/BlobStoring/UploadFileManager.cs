using Microsoft.AspNetCore.Http;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Core.Base;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class UploadFileManager : OrdManagerBase, IUploadFileManager
    {
        public Task<FileUploadDto> GetByFileIdAsync(Guid fileId)
        {
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
