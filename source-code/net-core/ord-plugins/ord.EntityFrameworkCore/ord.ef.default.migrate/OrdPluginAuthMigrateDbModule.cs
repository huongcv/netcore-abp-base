using Microsoft.Extensions.DependencyInjection;
using Ord.Domain.Services;
using Ord.EfCore.Default.MigrateDb.Data;
using Ord.EfCore.Default.MigrateDb.Services;
using Volo.Abp.Autofac;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.MySQL;
using Volo.Abp.Modularity;

namespace Ord.EfCore.Default.MigrateDb
{
    [DependsOn(
        typeof(AbpAutofacModule),
        typeof(AbpEntityFrameworkCoreMySQLModule)
    )]
    public class OrdPluginAuthMigrateDbModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            services.AddAbpDbContext<DbContextMigrate>();
            Configure<AbpDbContextOptions>(options =>
            {
                options.Configure(configurationContext =>
                {
                    configurationContext.UseMySQL();
                });
            });
            services.AddTransient<IOrdDbSchemaMigrator, DbSchemaMigrator>();
        }
    }
}
