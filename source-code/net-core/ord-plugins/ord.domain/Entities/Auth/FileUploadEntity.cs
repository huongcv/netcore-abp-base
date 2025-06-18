using Ord.Plugin.Contract.Features.BlobStoring;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Domain.Entities.Auth
{
    [Table("system_file_upload")]
    public class FileUploadEntity : FullAuditedEntity<Guid>
    {
        [MaxLength(500)]
        public string? FileName { get; set; }
        [MaxLength(200)]
        public string? MimeType { get; set; }
        [MaxLength(300)]
        public string? BlobContainerPath { get; set; }
        public FileStoreProvider? FileStoreProvider { get; set; }
    }
}
