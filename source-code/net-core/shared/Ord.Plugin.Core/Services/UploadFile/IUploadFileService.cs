using Microsoft.AspNetCore.Http;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Core.Services.UploadFile
{
    public interface IUploadFileService : ITransientDependency
    {
        Task<FileUploadDto> UploadFile(IFormFile file, string blobContainerPath);
        Task<FileUploadDto> UploadFile(byte[] fileByte, string fileName, string mimeType, string blobContainerPath);
        Task RemoveFile(Guid fileId);
        Task<FileUploadDto> Get(Guid fileId);
    }
}
