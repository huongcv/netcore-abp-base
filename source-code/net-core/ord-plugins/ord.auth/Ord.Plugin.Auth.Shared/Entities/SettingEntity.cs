using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Auth.Shared.Entities
{
    [Table("Settings")]
    public class SettingEntity : FullAuditedEntity<Guid>, IMultiTenant, IHasActived
    {
        public Guid? TenantId { get; set; }
        public Guid? UserId { get; set; }
        [MaxLength(200)]
        public string Name { get; set; }
        //[MaxLength(1000)]
        public string? Value { get; set; }
        public bool? MustEncrypt { get; set; }
        public bool IsActived { get; set; }
        public SettingType Type { get; set; }
        [Column(TypeName = "json")]
        public string? JObjectValue { get; set; }
    }
}
