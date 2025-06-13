using Hangfire;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
namespace Ord.Plugin.HostBase.Configurations
{
    public static partial class HangfireConfiguration
    {
        public static void AddHangfireMemory(this IServiceCollection services)
        {
            var configuration = services.GetConfiguration();
            services.Configure<HangfireOptions>(configuration.GetSection(HangfireOptions.SectionName));
            var hangfireOptions = GetHangfireOptions(configuration);
            if (hangfireOptions?.IsEnabled == true && !string.IsNullOrEmpty(hangfireOptions.ConnectionString))
            {
                services.AddHangfire(config =>
                {
                    config.UseMemoryStorage();
                });
                // Thêm Hangfire server
                services.AddHangfireServer();
            }
        }

        public static void UseHangfireConfiguration(this IApplicationBuilder app, IConfiguration configuration)
        {
            var hangfireOptions = GetHangfireOptions(configuration);
            if (hangfireOptions?.IsEnabled == true)
            {
                // Cấu hình Dashboard nếu được enable
                if (hangfireOptions.DashboardEnabled)
                {
                    app.UseHangfireDashboard(hangfireOptions.DashboardUrl, new DashboardOptions
                    {
                    });
                }
            }
        }

        static HangfireOptions GetHangfireOptions(IConfiguration configuration)
        {
            return configuration
                .GetSection(HangfireOptions.SectionName)
                .Get<HangfireOptions>();
        }
    }
   
}
