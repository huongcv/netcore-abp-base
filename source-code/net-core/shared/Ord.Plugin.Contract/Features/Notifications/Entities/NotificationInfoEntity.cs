using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;

namespace Ord.Plugin.Contract.Features.Notifications
{
    [Table("system_notifications")]
    public class NotificationInfoEntity : CreationAuditedEntity<Guid>
    {
        [Required]
        [StringLength(96)]
        public virtual string NotificationName { get; set; }
        public virtual string Data { get; set; }
        [StringLength(512)]
        public virtual string DataTypeName { get; set; }
        public virtual NotificationSeverity Severity { get; set; }
    }
}
