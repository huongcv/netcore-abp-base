using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract.Features.SystemSetting;
using Ord.Plugin.Contract.Features.SystemSetting.Dto;
using Volo.Abp.Modularity;

namespace Ord.Plugin.Core.Features.SystemSetting.Base
{
    public static class SystemSettingConfigServiceUtil
    {
        public static void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            services.AddScoped<IHostSystemSettingManager<PasswordConfigDto>, PasswordConfigManager>();
        }
    }
}
