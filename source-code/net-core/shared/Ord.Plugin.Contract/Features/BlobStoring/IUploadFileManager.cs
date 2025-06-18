using Microsoft.AspNetCore.Http;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface IUploadFileManager : IDomainService
    {
        Task<FileUploadDto> GetByFileIdAsync(Guid fileId);
        Task<FileUploadDto> UploadFileAsync(IFormFile file, string blobContainerPath);
        Task<FileUploadDto> UploadFileAsync(byte[] fileByte, string fileName, string mimeType, string blobContainerPath);
        Task RemoveFileAsync(Guid fileId);
    }
}
