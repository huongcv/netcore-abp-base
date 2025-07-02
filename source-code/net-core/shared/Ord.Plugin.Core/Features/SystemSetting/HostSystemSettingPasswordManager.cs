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

        protected override PasswordConfigDto ConvertEntitiesToDto(IEnumerable<SystemSettingDto> settingEntities)
        {
            var dict = settingEntities.ToDictionary(x => x.Name, x => x.Value);

            return new PasswordConfigDto
            {
                PasswordMinLength = GetInt(dict, "PasswordMinLength", 8),
                RequireUppercase = GetBool(dict, "RequireUppercase", true),
                RequireLowercase = GetBool(dict, "RequireLowercase", true),
                RequireNumbers = GetBool(dict, "RequireNumbers", true),
                RequireSpecialChars = GetBool(dict, "RequireSpecialChars", false),
                PasswordExpiry = GetInt(dict, "PasswordExpiry", 90),
                MaxLoginAttempts = GetInt(dict, "MaxLoginAttempts", 5),
            };
        }

        protected override IEnumerable<SystemSettingDto> ConvertDtoToEntities(PasswordConfigDto dto)
        {
            return new List<SystemSettingDto>
            {
                CreateSetting("PasswordMinLength", dto.PasswordMinLength.ToString()),
                CreateSetting("RequireUppercase", dto.RequireUppercase.ToString()),
                CreateSetting("RequireLowercase", dto.RequireLowercase.ToString()),
                CreateSetting("RequireNumbers", dto.RequireNumbers.ToString()),
                CreateSetting("RequireSpecialChars", dto.RequireSpecialChars.ToString()),
                CreateSetting("PasswordExpiry", dto.PasswordExpiry.ToString()),
                CreateSetting("MaxLoginAttempts", dto.MaxLoginAttempts.ToString())
            };
        }

        public override PasswordConfigDto GetDefaultValue()
        {
            return new PasswordConfigDto();
        }
    }
}
