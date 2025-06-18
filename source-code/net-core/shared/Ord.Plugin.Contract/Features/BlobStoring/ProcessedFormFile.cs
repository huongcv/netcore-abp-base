using Microsoft.AspNetCore.Http;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    // Helper class để tạo IFormFile từ processed stream
    public class ProcessedFormFile : IFormFile, IDisposable
    {
        private readonly Stream _stream;

        public ProcessedFormFile(Stream stream, string fileName, string contentType, long length)
        {
            _stream = stream;
            FileName = fileName;
            ContentType = contentType;
            Length = length;
            Name = fileName;
        }

        public string ContentType { get; }
        public string ContentDisposition => $"form-data; name=\"{Name}\"; filename=\"{FileName}\"";
        public IHeaderDictionary Headers => new HeaderDictionary();
        public long Length { get; }
        public string Name { get; }
        public string FileName { get; }

        public Stream OpenReadStream() => _stream;

        public void CopyTo(Stream target) => _stream.CopyTo(target);

        public Task CopyToAsync(Stream target, CancellationToken cancellationToken = default)
            => _stream.CopyToAsync(target, cancellationToken);

        public void Dispose() => _stream?.Dispose();
    }
}
