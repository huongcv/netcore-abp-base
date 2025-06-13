using Hangfire;
using Hangfire.MySql;
using Microsoft.Extensions.DependencyInjection;
namespace Ord.Plugin.HostBase.Configurations
{
    public  static partial class HangfireConfiguration
    {
        public static void AddHangfireMysql(this IServiceCollection services)
        {
            var configuration = services.GetConfiguration();
            services.Configure<HangfireOptions>(configuration.GetSection(HangfireOptions.SectionName));
            var hangfireOptions = GetHangfireOptions(configuration);
            if (hangfireOptions?.IsEnabled == true && !string.IsNullOrEmpty(hangfireOptions.ConnectionString))
            {
                services.AddHangfire(config =>
                {
                    config.UseStorage(new MySqlStorage(hangfireOptions.ConnectionString,
                        new MySqlStorageOptions
                        {
                            TablesPrefix = "hf_"
                        })
                    );
                });
                // Thêm Hangfire server
                services.AddHangfireServer();
            }
        }
    }
}
