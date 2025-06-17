using Microsoft.Extensions.DependencyInjection;
using Ord.EfCore.Default.MigrateDb.Services;
using Ord.Plugin.Auth.MigrateDb.Data;
using Ord.Plugin.Contract;
using Volo.Abp.Autofac;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.MySQL;
using Volo.Abp.Modularity;

namespace Ord.EfCore.Default.MigrateDb
{
    [DependsOn(
        typeof(AbpAutofacModule),
        typeof(OrdPluginContractModule),
        typeof(AbpEntityFrameworkCoreMySQLModule)
    )]
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
