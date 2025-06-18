using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Contract.Features.BlobStoring
{
    public class FileUploadDto : EntityDto<Guid>
    {
        public string FileName { get; set; }
        public string MimeType { get; set; }
        public byte[]? Bytes { get; set; }
    }
}
