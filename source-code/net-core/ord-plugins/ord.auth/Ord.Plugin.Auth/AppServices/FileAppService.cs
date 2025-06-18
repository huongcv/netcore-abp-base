using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.BlobStoring;
using Ord.Plugin.Contract.Utils;
using Ord.Plugin.Core.Base;
using Volo.Abp.Domain.Entities;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class FileAppService : OrdAppServiceBase
    {
        private IUploadFileManager UploadFileManager => AppFactory.GetServiceDependency<IUploadFileManager>();
        private IFileValidationService FileValidationService => AppFactory.GetServiceDependency<IFileValidationService>();
        private IImageProcessingService ImageProcessingService => AppFactory.GetServiceDependency<IImageProcessingService>();
        protected override string GetBasePermissionName()
        {
            return "UploadFile";
        }

        [HttpPost]
        public async Task<CommonResultDto<List<FileUploadDto>>> UploadImageAsync([FromForm] IEnumerable<IFormFile> files)
        {
            var fileDtos = new List<FileUploadDto>();
            foreach (var file in files)
            {
                await FileValidationService.ValidateImageAsync(file, 10);
            }

            foreach (var file in files)
            {

                // Process và resize ảnh
                using var processedFile = await ImageProcessingService.ResizeImageAsync(file, 200, 200);
                // Upload file đã được xử lý
                var uploadDto = await UploadFileManager.UploadFileAsync(
                    FileStoreProvider.FileSystem,
                    processedFile,
                    "Upload/Images"
                );

                fileDtos.Add(uploadDto);
            }

            return AppFactory.CreateSuccessResult(fileDtos);
        }

        [HttpGet("GetFileById/{id}")]
        public async Task<IActionResult> GetFileByIdAsync(Guid id)
        {
            var fileDto = await UploadFileManager.GetByFileIdAsync(id);
            if (fileDto == null || fileDto.BlobStream == null)
            {
                throw new EntityNotFoundException("message.fileNotExists");
            }

            var stream = fileDto.BlobStream;
            return new FileStreamResult(stream, fileDto.FileName.GetMimeType())
            {
                FileDownloadName = fileDto?.FileName
            };
        }

        //private async Task ValidateImageFileAsync(IFormFile file)
        //{
        //    // Kiểm tra file không null và có nội dung
        //    if (file == null || file.Length == 0)
        //    {
        //        throw new AbpValidationException("File không được để trống");
        //    }

        //    // Kiểm tra kích thước file
        //    if (file.Length > _maxFileSizeBytes)
        //    {
        //        throw new AbpValidationException($"Kích thước file không được vượt quá {_maxFileSizeBytes / (1024 * 1024)}MB");
        //    }

        //    // Kiểm tra extension
        //    var fileExtension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
        //    if (string.IsNullOrEmpty(fileExtension) || !_allowedImageExtensions.Contains(fileExtension))
        //    {
        //        throw new AbpValidationException($"Chỉ chấp nhận các định dạng: {string.Join(", ", _allowedImageExtensions)}");
        //    }

        //    // Kiểm tra MIME type
        //    if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        //    {
        //        throw new AbpValidationException($"MIME type không hợp lệ: {file.ContentType}");
        //    }

        //    // Kiểm tra file có thực sự là ảnh bằng cách đọc header
        //    await ValidateImageHeaderAsync(file);
        //}

        //private async Task ValidateImageHeaderAsync(IFormFile file)
        //{
        //    try
        //    {
        //        using var stream = file.OpenReadStream();
        //        using var image = await Image.LoadAsync(stream);

        //        // Kiểm tra kích thước ảnh
        //        if (image.Width > _maxImageWidth || image.Height > _maxImageHeight)
        //        {
        //            // Sẽ resize sau, chỉ cảnh báo nếu quá lớn
        //            // throw new AbpValidationException($"Kích thước ảnh không được vượt quá {_maxImageWidth}x{_maxImageHeight}px");
        //        }
        //    }
        //    catch (Exception ex) when (!(ex is AbpValidationException))
        //    {
        //        throw new AbpValidationException("File không phải là ảnh hợp lệ");
        //    }
        //}

        //private async Task<ProcessedFormFile> ProcessImageAsync(IFormFile originalFile)
        //{
        //    using var originalStream = originalFile.OpenReadStream();
        //    using var image = await Image.LoadAsync(originalStream);

        //    var memoryStream = new MemoryStream();

        //    // Resize ảnh nếu cần thiết
        //    if (image.Width > _maxImageWidth || image.Height > _maxImageHeight)
        //    {
        //        // Tính toán tỷ lệ resize để giữ nguyên aspect ratio
        //        var ratioX = (double)_maxImageWidth / image.Width;
        //        var ratioY = (double)_maxImageHeight / image.Height;
        //        var ratio = Math.Min(ratioX, ratioY);

        //        var newWidth = (int)(image.Width * ratio);
        //        var newHeight = (int)(image.Height * ratio);

        //        image.Mutate(x => x.Resize(newWidth, newHeight));
        //    }

        //    // Chọn format để save dựa trên extension gốc
        //    var extension = Path.GetExtension(originalFile.FileName)?.ToLowerInvariant();

        //    switch (extension)
        //    {
        //        case ".png":
        //            await image.SaveAsPngAsync(memoryStream);
        //            break;
        //        case ".webp":
        //            await image.SaveAsWebpAsync(memoryStream);
        //            break;
        //        case ".gif":
        //            await image.SaveAsGifAsync(memoryStream);
        //            break;
        //        case ".bmp":
        //            await image.SaveAsBmpAsync(memoryStream);
        //            break;
        //        default: // jpg, jpeg
        //            await image.SaveAsJpegAsync(memoryStream, new JpegEncoder { Quality = 85 });
        //            break;
        //    }

        //    memoryStream.Position = 0;

        //    // Tạo IFormFile mới từ stream đã xử lý
        //    return new ProcessedFormFile(
        //        memoryStream,
        //        originalFile.FileName,
        //        originalFile.ContentType,
        //        memoryStream.Length
        //    );
        //}

        //// Tạo thumbnail (tùy chọn)
        //[HttpPost("upload-with-thumbnail")]
        //public async Task<CommonResultDto<FileUploadWithThumbnailDto>> UploadImageWithThumbnailAsync([FromForm] IFormFile file)
        //{
        //    // Validate file
        //    await ValidateImageFileAsync(file);

        //    // Process ảnh chính
        //    var processedFile = await ProcessImageAsync(file);

        //    // Tạo thumbnail
        //    var thumbnailFile = await CreateThumbnailAsync(file);

        //    // Upload cả hai
        //    var mainImageDto = await UploadFileManager.UploadFileAsync(
        //        FileStoreProvider.FileSystem,
        //        processedFile,
        //        "Upload/Images"
        //    );

        //    var thumbnailDto = await UploadFileManager.UploadFileAsync(
        //        FileStoreProvider.FileSystem,
        //        thumbnailFile,
        //        "Upload/Thumbnails"
        //    );

        //    var result = new FileUploadWithThumbnailDto
        //    {
        //        MainImage = mainImageDto,
        //        Thumbnail = thumbnailDto
        //    };

        //    return AppFactory.CreateSuccessResult(result);
        //}

        //private async Task<IFormFile> CreateThumbnailAsync(IFormFile originalFile)
        //{
        //    using var originalStream = originalFile.OpenReadStream();
        //    using var image = await Image.LoadAsync(originalStream);

        //    var memoryStream = new MemoryStream();

        //    // Resize thành thumbnail với crop center
        //    image.Mutate(x => x
        //        .Resize(new ResizeOptions
        //        {
        //            Size = new Size(_thumbnailWidth, _thumbnailHeight),
        //            Mode = ResizeMode.Crop,
        //            Position = AnchorPositionMode.Center
        //        }));

        //    // Save as JPEG với quality cao cho thumbnail
        //    await image.SaveAsJpegAsync(memoryStream, new JpegEncoder { Quality = 90 });

        //    memoryStream.Position = 0;

        //    var thumbnailFileName = Path.GetFileNameWithoutExtension(originalFile.FileName) + "_thumb.jpg";

        //    return new ProcessedFormFile(
        //        memoryStream,
        //        thumbnailFileName,
        //        "image/jpeg",
        //        memoryStream.Length
        //    );
        //}
    }

    // DTO cho upload with thumbnail
    public class FileUploadWithThumbnailDto
    {
        public FileUploadDto MainImage { get; set; }
        public FileUploadDto Thumbnail { get; set; }
    }
}