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
            return "System.PasswordConfig";
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

            //var dict = settingEntities.ToDictionary(x => x.Name, x => x.Value);

            //return new PasswordConfigDto
            //{
            //    PasswordMinLength = GetInt(dict, "PasswordMinLength", 8),
            //    RequireUppercase = GetBool(dict, "RequireUppercase", true),
            //    RequireLowercase = GetBool(dict, "RequireLowercase", true),
            //    RequireNumbers = GetBool(dict, "RequireNumbers", true),
            //    RequireSpecialChars = GetBool(dict, "RequireSpecialChars", false),
            //    PasswordExpiry = GetInt(dict, "PasswordExpiry", 90),
            //    MaxLoginAttempts = GetInt(dict, "MaxLoginAttempts", 5),
            //};
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
