using Microsoft.AspNetCore.Http;
using Ord.Plugin.Contract.Features.BlobStoring;
using Volo.Abp.Domain.Services;
using Volo.Abp.Validation;

namespace Ord.Plugin.Core.Services
{
    public class FileValidationService : DomainService, IFileValidationService
    {
        // Default allowed image extensions
        private readonly string[] _defaultImageExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp" };

        public async Task ValidateImageAsync(IFormFile file, long maxSizeInMB)
        {
            await ValidateFileAsync(file, maxSizeInMB, _defaultImageExtensions);
        }

        public async Task ValidateFileAsync(IFormFile file, long maxSizeInMB, params string[] allowedExtensions)
        {
            // 1. Check file not null or empty
            if (file == null || file.Length == 0)
                throw new AbpValidationException("File không được để trống");

            // 2. Check file size
            var maxSizeBytes = maxSizeInMB * 1024 * 1024;
            if (file.Length > maxSizeBytes)
                throw new AbpValidationException($"Kích thước file {file.Length / (1024 * 1024)}MB vượt quá giới hạn {maxSizeInMB}MB");

            // 3. Check file extension
            var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
            if (string.IsNullOrEmpty(extension))
                throw new AbpValidationException("File không có phần mở rộng");

            var normalizedExtensions = allowedExtensions
                .Select(ext => ext.StartsWith('.') ? ext.ToLowerInvariant() : $".{ext.ToLowerInvariant()}")
                .ToArray();

            if (!normalizedExtensions.Contains(extension))
                throw new AbpValidationException($"Chỉ chấp nhận các định dạng: {string.Join(", ", normalizedExtensions)}");

            // 4. Check MIME type
            var allowedMimeTypes = GetMimeTypesForExtensions(normalizedExtensions);
            if (!allowedMimeTypes.Contains(file.ContentType?.ToLowerInvariant()))
                throw new AbpValidationException($"MIME type '{file.ContentType}' không được hỗ trợ");
        }

        private string[] GetMimeTypesForExtensions(string[] extensions)
        {
            var mimeTypeMap = new Dictionary<string, string>
            {
                // Images
                {".jpg", "image/jpeg"}, {".jpeg", "image/jpeg"}, {".png", "image/png"},
                {".gif", "image/gif"}, {".bmp", "image/bmp"}, {".webp", "image/webp"},
                
                // Documents  
                {".pdf", "application/pdf"}, {".doc", "application/msword"},
                {".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".txt", "text/plain"}
            };

            return extensions
                .Where(ext => mimeTypeMap.ContainsKey(ext))
                .Select(ext => mimeTypeMap[ext])
                .Distinct()
                .ToArray();
        }
    }
}