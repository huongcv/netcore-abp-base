using Microsoft.AspNetCore.Http;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public interface IImageProcessingService : IDomainService
    {
        Task<ProcessedFormFile> ResizeImageAsync(IFormFile originalFile, int maxWidth, int maxHeight);
        Task<ProcessedFormFile> CreateThumbnailAsync(IFormFile originalFile, int size = 300);
        Task<ProcessedFormFile> CreateThumbnailAsync(IFormFile originalFile, int width, int height);
        Task<ProcessedFormFile> CompressImageAsync(IFormFile originalFile, int quality = 85);
    }
}
