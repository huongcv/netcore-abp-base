using Ord.Plugin.Contract.Attributes;
using Ord.Plugin.Contract.Enums;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos
{
    public class SettingDto : EntityDto<Guid>
    {
        public Guid? TenantId { get; set; }
        public Guid? UserId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        [IgnoreColumnName]
        public string RawValue { get; set; }
        public bool? MustEncrypt { get; set; }
        public bool IsActived { get; set; }
        public SettingType Type { get; set; }
    }
}
