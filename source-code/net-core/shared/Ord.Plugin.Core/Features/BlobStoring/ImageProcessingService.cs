using Microsoft.AspNetCore.Http;
using Ord.Plugin.Contract.Features.BlobStoring;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Core.Features.BlobStoring
{
    public class ImageProcessingService : DomainService, IImageProcessingService
    {
        public async Task<ProcessedFormFile> ResizeImageAsync(IFormFile originalFile, int maxWidth, int maxHeight)
        {
            var options = new ImageProcessingOptions
            {
                MaxWidth = maxWidth,
                MaxHeight = maxHeight,
                Quality = 85,
                KeepAspectRatio = true
            };

            return await ProcessImageAsync(originalFile, options);
        }

        public async Task<ProcessedFormFile> CreateThumbnailAsync(IFormFile originalFile, int size = 300)
        {
            return await CreateThumbnailAsync(originalFile, size, size);
        }

        public async Task<ProcessedFormFile> CreateThumbnailAsync(IFormFile originalFile, int width, int height)
        {
            var options = new ThumbnailOptions
            {
                Width = width,
                Height = height,
                Mode = ResizeMode.Crop,
                Position = AnchorPositionMode.Center,
                Quality = 90
            };

            return await CreateThumbnailInternalAsync(originalFile, options);
        }

        public async Task<ProcessedFormFile> CompressImageAsync(IFormFile originalFile, int quality = 85)
        {
            var options = new ImageProcessingOptions
            {
                Quality = quality
            };

            return await ProcessImageAsync(originalFile, options);
        }

        // PRIVATE METHODS
        private async Task<ProcessedFormFile> ProcessImageAsync(IFormFile originalFile, ImageProcessingOptions options)
        {
            using var originalStream = originalFile.OpenReadStream();
            using var image = await Image.LoadAsync(originalStream);

            var memoryStream = new MemoryStream();

            // Resize nếu cần
            if (options.MaxWidth.HasValue || options.MaxHeight.HasValue)
            {
                var newSize = CalculateNewSize(
                    image.Width, image.Height,
                    options.MaxWidth, options.MaxHeight,
                    options.KeepAspectRatio, options.AllowEnlarge
                );

                if (newSize.width != image.Width || newSize.height != image.Height)
                {
                    image.Mutate(x => x.Resize(newSize.width, newSize.height));
                }
            }

            // Save với format và quality phù hợp
            await SaveImageAsync(image, memoryStream, originalFile.FileName, options.Quality, options.OutputFormat);

            memoryStream.Position = 0;

            return new ProcessedFormFile(
                memoryStream,
                originalFile.FileName,
                GetContentType(originalFile.FileName, options.OutputFormat),
                memoryStream.Length
            );
        }

        private async Task<ProcessedFormFile> CreateThumbnailInternalAsync(IFormFile originalFile, ThumbnailOptions options)
        {
            using var originalStream = originalFile.OpenReadStream();
            using var image = await Image.LoadAsync(originalStream);

            var memoryStream = new MemoryStream();

            // Resize với mode khác nhau
            var resizeOptions = new ResizeOptions
            {
                Size = new Size(options.Width, options.Height),
                Mode = options.Mode,
                Position = options.Position
            };

            image.Mutate(x => x.Resize(resizeOptions));

            // Save thumbnail as JPEG với quality cao
            await image.SaveAsJpegAsync(memoryStream, new JpegEncoder { Quality = options.Quality });

            memoryStream.Position = 0;

            var thumbnailFileName = Path.GetFileNameWithoutExtension(originalFile.FileName) + "_thumb.jpg";

            return new ProcessedFormFile(
                memoryStream,
                thumbnailFileName,
                "image/jpeg",
                memoryStream.Length
            );
        }

        private (int width, int height) CalculateNewSize(
            int originalWidth, int originalHeight,
            int? maxWidth, int? maxHeight,
            bool keepAspectRatio, bool allowEnlarge)
        {
            if (!maxWidth.HasValue && !maxHeight.HasValue)
                return (originalWidth, originalHeight);

            var targetWidth = maxWidth ?? originalWidth;
            var targetHeight = maxHeight ?? originalHeight;

            if (!keepAspectRatio)
                return (targetWidth, targetHeight);

            // Tính tỷ lệ resize
            var ratioX = maxWidth.HasValue ? (double)targetWidth / originalWidth : double.MaxValue;
            var ratioY = maxHeight.HasValue ? (double)targetHeight / originalHeight : double.MaxValue;
            var ratio = Math.Min(ratioX, ratioY);

            // Không phóng to nếu allowEnlarge = false
            if (!allowEnlarge && ratio > 1.0)
                ratio = 1.0;

            var newWidth = (int)(originalWidth * ratio);
            var newHeight = (int)(originalHeight * ratio);

            return (newWidth, newHeight);
        }

        private async Task SaveImageAsync(Image image, Stream stream, string fileName, int quality, string outputFormat)
        {
            var extension = Path.GetExtension(fileName)?.ToLowerInvariant();

            // Ưu tiên format được chỉ định, sau đó là extension gốc
            var format = !string.IsNullOrEmpty(outputFormat) ? outputFormat.ToLowerInvariant() :
                        extension?.TrimStart('.') ?? "jpeg";

            switch (format)
            {
                case "png":
                    await image.SaveAsPngAsync(stream);
                    break;
                case "webp":
                    await image.SaveAsWebpAsync(stream);
                    break;
                case "gif":
                    await image.SaveAsGifAsync(stream);
                    break;
                case "bmp":
                    await image.SaveAsBmpAsync(stream);
                    break;
                default: // jpeg
                    await image.SaveAsJpegAsync(stream, new JpegEncoder { Quality = quality });
                    break;
            }
        }

        private string GetContentType(string fileName, string outputFormat)
        {
            var format = !string.IsNullOrEmpty(outputFormat) ? outputFormat.ToLowerInvariant() :
                        Path.GetExtension(fileName)?.ToLowerInvariant().TrimStart('.');

            return format switch
            {
                "png" => "image/png",
                "webp" => "image/webp",
                "gif" => "image/gif",
                "bmp" => "image/bmp",
                _ => "image/jpeg"
            };
        }
    }
}