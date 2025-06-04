using Hangfire;
using Hangfire.MemoryStorage;
using Hangfire.MySql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
namespace Ord.Plugin.HostBase.Configurations
{
    public static class HangfireConfiguration
    {
        public static void ConfigureHangfire(this IServiceCollection services)
        {
            var configuration = services.GetConfiguration();
            services.Configure<HangfireOptions>(configuration.GetSection(HangfireOptions.SectionName));
            var hangfireOptions = GetHangfireOptions(configuration);
            if (hangfireOptions?.IsEnabled == true && !string.IsNullOrEmpty(hangfireOptions.ConnectionString))
            {
                services.AddHangfire(config =>
                {
#if DEBUG
                    config.UseMemoryStorage();
#else
                    config.UseStorage(new MySqlStorage(hangfireOptions.ConnectionString,
                        new MySqlStorageOptions
                        {
                            TablesPrefix = "hf_"
                        })
                    );
#endif
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

        static HangfireOptions GetHangfireOptions(Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            return configuration
                .GetSection(HangfireOptions.SectionName)
                .Get<HangfireOptions>();
        }
    }
    public class HangfireOptions
    {
        public const string SectionName = "Hangfire";

        public bool IsEnabled { get; set; } = false;
        public string ConnectionString { get; set; } = string.Empty;
        public string DashboardUrl { get; set; } = "/hangfire";
        public bool DashboardEnabled { get; set; } = false;
    }
}
