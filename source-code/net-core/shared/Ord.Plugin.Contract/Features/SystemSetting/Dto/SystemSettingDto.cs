using Ord.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Contract.Features.SystemSetting.Dto
{
    // dto của SettingEntity
    public class SystemSettingDto:EntityDto<Guid>
    {
        public Guid? TenantId { get; set; }
        public Guid? UserId { get; set; }
        [MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(600)]
        public string? Value { get; set; }
        public bool? MustEncrypt { get; set; }
        public bool IsActived { get; set; }
        public SettingType Type { get; set; }
        [Column(TypeName = "json")]
        public string? JObjectValue { get; set; }

        public string? DecryptValue { get; set; }
    }
}
