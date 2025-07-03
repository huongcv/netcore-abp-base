using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Ord.Plugin.Core.Features.SystemSetting.Base;

namespace Ord.Plugin.Core.Features.SystemSetting
{
    public class HostSystemSmtpManager : HostSystemSettingManager<SmtpMailingDto>
    {
        protected override string GetPrefixSettingName()
        {
            return "App:Setting:Mailing.Smtp";
        }

        protected override async Task<SmtpMailingDto> ConvertEntitiesToDto(IEnumerable<SystemSettingDto> settingEntities)
        {
            var dict = settingEntities.ToDictionary(x => x.Name, x => x.Value);

            return new SmtpMailingDto
            {
                Host = GetString(dict, "Host"),
                Port = GetInt(dict, "Port", 587),
                Username = GetString(dict, "Username"),
                Password = GetString(dict, "Password"),
                DisplayName = GetString(dict, "DisplayName"),
                EnableSsl = GetBool(dict, "EnableSsl", false),
            };
        }

        protected override IEnumerable<SystemSettingDto> ConvertDtoToEntities(SmtpMailingDto dto)
        {
            var ret = new List<SystemSettingDto>
            {
                CreateSetting("Host", dto.Host),
                CreateSetting("Port", dto.Port.ToString()),
                CreateSetting("Username", dto.Username),
               
                CreateSetting("DisplayName", dto.DisplayName),
                CreateSetting("EnableSsl", dto.EnableSsl.ToString())
            };
            if (!string.IsNullOrEmpty(dto.Password))
            {
                CreateSetting("Password", dto.Password, true);
            }

            return ret;
        }

        public override SmtpMailingDto GetDefaultValue()
        {
            return new SmtpMailingDto()
            {
                Host = "smtp.gmail.com",
                Port = 587
            };
        }
    }
}
