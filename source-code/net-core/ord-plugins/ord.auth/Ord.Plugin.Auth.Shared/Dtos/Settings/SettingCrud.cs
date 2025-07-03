using AutoMapper;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.Validation.Attributes;
using System.Text.Json.Serialization;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Dtos.Settings
{
    [AutoMap(typeof(SettingEntity), ReverseMap = true)]
    public class SettingCrudBase : IHasActived
    {
        [OrdValidateRequired]
        [OrdMaxLengthString(200)]
        public string? Name { get; set; }
        [OrdValidateRequired]
        [OrdMaxLengthString(500)]
        public string? Value { get; set; }
        public string? JObjectValue { get; set; }
        public bool? MustEncrypt { get; set; }
        public bool IsActived { get; set; }
        [JsonIgnore]
        public SettingType Type { get; set; }
    }
    public class SettingPagedDto : SettingCrudBase, IEntityDto<Guid>, IHasEncodedId
    {
        public Guid Id { get; set; }
        public DateTime CreationTime { get; set; }
        public string? EncodedId { get; set; }
    }
    public class SettingPagedInput : OrdPagedRequestDto
    {
        [JsonIgnore]
        public SettingType? Type { get; set; }
        public bool? IsStatic { get; set; }
    }
    public class SettingDetailDto : SettingPagedDto
    {
    }
    public class CreateSettingDto : SettingCrudBase
    {
    }

    public class UpdateSettingDto : SettingCrudBase, IHasEncodedId
    {
        [OrdValidateRequired]
        public string? EncodedId { get; set; }
    }
}
