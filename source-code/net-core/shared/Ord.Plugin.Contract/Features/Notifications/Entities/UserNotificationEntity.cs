using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Auditing;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Contract.Features.Notifications.Entities
{
    [Table("system_user_notifications")]
    public class UserNotificationEntity : Entity<Guid>, IHasCreationTime, IMultiTenant
    {
        public virtual DateTime CreationTime { get; set; }
        public virtual Guid? TenantId { get; set; }
        public virtual Guid UserId { get; set; }
        public virtual bool State { get; set; }
        public virtual Guid NotificationId { get; set; }
        public virtual bool? IsExcluded { get; set; }
    }
}
