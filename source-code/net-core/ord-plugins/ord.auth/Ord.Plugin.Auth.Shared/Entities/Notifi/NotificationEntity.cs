using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table(TableName)]
    public class NotificationUserEntity : CreationAuditedEntity<Guid>, IMultiTenant
    {
        public const string TableName = "system_notificationUser";

        public NotificationUserEntity()
        {
            this.Id = Guid.NewGuid();
        }

        public Guid? TenantId { get; protected set; }

        public virtual Guid UserId { get; set; }

        public virtual bool State { get; set; }
        public Guid NotificationId { get; set; }
    }

    [Table(TableName)]
    public class NotificationEntity : CreationAuditedEntity<Guid>, IMultiTenant
    {
        public NotificationEntity()
        {
            this.Id = Guid.NewGuid();
        }

        public const string TableName = "system_notification";

        public Guid? TenantId { get; protected set; }
        [MaxLength(300)] public string? Title { get; set; }
        [MaxLength(3000)] public string? Body { get; set; }
        [MaxLength(200)] public string NotificationName { get; set; }
        public string? Data { get; set; }
    }
}