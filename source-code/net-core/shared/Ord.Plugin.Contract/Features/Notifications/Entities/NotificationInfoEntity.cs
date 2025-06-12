using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Contract.Features.Notifications
{
    [Table("system_notifications")]
    public class NotificationInfoEntity : CreationAuditedEntity<Guid>, IMultiTenant
    {
        public Guid? TenantId { get; set; }
        [Required]
        [StringLength(200)]
        public virtual string NotificationName { get; set; }
        public virtual string Data { get; set; }
        [StringLength(512)]
        public virtual string DataTypeName { get; set; }
        public virtual NotificationSeverity Severity { get; set; }
        public virtual NotificationType NotificationType { get; set; }
    }
}
