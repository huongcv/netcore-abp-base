using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Auth.MigrateDb.Data;
using Ord.Plugin.Auth.MigrateDb.Services;
using Ord.Plugin.Contract;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Ord.Plugin.Auth.MigrateDb
{
    public class OrdPluginAuthMigrateDbModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            services.AddAbpDbContext<OrdPluginAuthDbContextMigrate>();
            Configure<AbpDbContextOptions>(options =>
            {
                options.Configure(configurationContext =>
                {
                    configurationContext.UseMySQL();
                });
            });
            context.Services.AddTransient<IOrdPluginDbSchemaMigrator, OrdPluginAuthDbSchemaMigrator>();
        }
    }
}
