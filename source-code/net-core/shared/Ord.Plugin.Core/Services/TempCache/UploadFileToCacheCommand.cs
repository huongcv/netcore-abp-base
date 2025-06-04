using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Services.UploadFile;
using Volo.Abp.Caching;

namespace Ord.Plugin.Core.Services.TemplateCache
{
    /// <summary>
    /// Upload file Vào cache
    /// </summary>
    public class UploadFileToCacheCommand : IRequest<FileUploadDto>
    {
        public long FileSize { get; set; }
        public string FileName { get; set; }
        public string MimeType { get; set; }
        public byte[] Bytes { get; set; }
        public UploadFileToCacheCommand(IFormFile file)
        {
            FileSize = file.Length;
            FileName = file.FileName;
            MimeType = file.ContentType;
            using var memoryStream = new MemoryStream();
            file.CopyTo(memoryStream);
            memoryStream.Position = 0;
            Bytes = memoryStream.ToArray();
        }
        public UploadFileToCacheCommand(string fileName, string contentType, long fileSize, byte[] bytes)
        {
            FileSize = fileSize;
            FileName = fileName;
            MimeType = contentType;
            Bytes = bytes;
        }
        public UploadFileToCacheCommand(string fileName, string contentType, string base64)
        {
            FileName = fileName;
            MimeType = contentType;
            var spltBase64 = base64.Split(";base64,");
            Bytes = Convert.FromBase64String(spltBase64[1]);
            FileSize = Bytes.Length;
        }
        private class Handler : IRequestHandler<UploadFileToCacheCommand, FileUploadDto>
        {
            private readonly IAppFactory _appFactory;

            public Handler(IAppFactory appFactory)
            {
                _appFactory = appFactory;
            }

            private IDistributedCache<FileUploadDto, Guid> DocumentDtoCache =>
               _appFactory.GetServiceDependency<IDistributedCache<FileUploadDto, Guid>>();


            async Task<FileUploadDto> IRequestHandler<UploadFileToCacheCommand, FileUploadDto>.Handle(UploadFileToCacheCommand request, CancellationToken cancellationToken)
            {
                var input = new FileUploadDto
                {
                    FileId = _appFactory.GuidGenerator.Create(),
                    FileName = request.FileName,
                    MimeType = request.MimeType,
                    Bytes = request.Bytes
                };
                await DocumentDtoCache.SetAsync(input.FileId, input, new DistributedCacheEntryOptions()
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                });
                return input;
            }
        }
    }
}
