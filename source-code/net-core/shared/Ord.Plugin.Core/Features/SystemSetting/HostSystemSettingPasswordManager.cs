using Newtonsoft.Json;
using Ord.Plugin.Contract.Features.SystemSetting;
using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Ord.Plugin.Core.Features.SystemSetting.Base;

namespace Ord.Plugin.Core.Features.SystemSetting
{
    public class PasswordConfigManager : HostSystemSettingManager<PasswordConfigDto>, IHostSystemSettingManager<PasswordConfigDto>
    {
        protected override string GetPrefixSettingName()
        {
            return PasswordConfigDto.PrefixName;
        }

        protected override async Task<PasswordConfigDto> ConvertEntitiesToDto(IEnumerable<SystemSettingDto> settingEntities)
        {
            if (settingEntities?.Any() == true)
            {
                var id = settingEntities.FirstOrDefault().Id;
                var jObject = await GetJObjectValue(id);
                try
                {
                    return JsonConvert.DeserializeObject<PasswordConfigDto>(jObject);
                }
                catch
                {
                    return GetDefaultValue();
                }
            }
            return GetDefaultValue();
        }

        protected override IEnumerable<SystemSettingDto> ConvertDtoToEntities(PasswordConfigDto dto)
        {

            var jObject = JsonConvert.SerializeObject(dto);
            return new List<SystemSettingDto>
            {
                CreateJObjectSetting(jObject)
            };
        }

        public override PasswordConfigDto GetDefaultValue()
        {
            return new PasswordConfigDto();
        }
    }
}
