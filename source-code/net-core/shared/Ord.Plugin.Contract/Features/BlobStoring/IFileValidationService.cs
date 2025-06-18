using Microsoft.AspNetCore.Http;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface IFileValidationService : IDomainService
    {
        Task ValidateImageAsync(IFormFile file, long maxSizeInMB);
        Task ValidateFileAsync(IFormFile file, long maxSizeInMB, params string[] allowedExtensions);
    }
}
