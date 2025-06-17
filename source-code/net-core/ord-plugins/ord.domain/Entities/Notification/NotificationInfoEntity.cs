using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Plugin.Contract.Features.Notifications
{
    /// <summary>
    /// Bảng system_notifications không cần multi-tenant
    /// </summary>
    [Table("system_notifications")]
    public class NotificationInfoEntity : CreationAuditedEntity<Guid>
    {
        [Required]
        [StringLength(200)]
        public virtual string NotificationName { get; set; }
        [StringLength(300)]
        public virtual string? Title { get; set; }
        [StringLength(1000)]
        public virtual string? Body { get; set; }
        [Column(TypeName = "json")]
        public virtual string? DataJson { get; set; }
        public virtual NotificationSeverity Severity { get; set; }
    }
}
