using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ord.Plugin.Contract.Base;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Contract.Features.Notifications.Entities
{
    [Table("user_firebase_devices")]
    public class UserFirebaseDeviceEntity : FullAuditedEntity<Guid>, IMultiTenant,IHasActived
    {
        public Guid? TenantId { get; set; }
        public Guid UserId { get; set; }
        /// <summary>
        /// Firebase registration token
        /// </summary>
        [MaxLength(500)]
        public string FirebaseToken { get; set; }

        /// <summary>
        /// Unique device identifier
        /// </summary>
        [MaxLength(100)]
        public string DeviceId { get; set; }
        /// <summary>
        /// Device name/model
        /// </summary>
        [MaxLength(100)]
        public string? DeviceName { get; set; }
        /// <summary>
        /// Platform: ios, android, web
        /// </summary>
        [MaxLength(20)]
        public string Platform { get; set; }
        public DateTime? LastLoginTime { get; set; }
        public bool IsActived { get; set; }
    }
}
