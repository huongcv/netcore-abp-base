using Microsoft.AspNetCore.Http;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface IUploadFileManager : IDomainService
    {
        Task<FileUploadDto> UploadFile(IFormFile file, string blobContainerPath);
        Task<FileUploadDto> UploadFile(byte[] fileByte, string fileName, string mimeType, string blobContainerPath);
        Task RemoveFile(Guid fileId);
        Task<FileUploadDto> Get(Guid fileId);
    }
}
