using MediatR;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Enums;

namespace Ord.Plugin.Contract.Setting
{
    public class SetValueSettingCommand : IRequest<CommonResultDto<SettingDto>>
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public string? FileIdAssFromValue { get; set; } // Value cũ ass lại => nhằm mục đích xoá mimio
        public bool? MustEncrypt { get; set; }
        public bool IsActived { get; set; }
        public bool? IsJsonValue { get; set; }
        public SettingType Type { get; set; }
    }
}
