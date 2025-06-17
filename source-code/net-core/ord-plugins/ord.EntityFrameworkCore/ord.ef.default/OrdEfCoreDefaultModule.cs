using Microsoft.Extensions.DependencyInjection;
using Ord.EfCore.Default.EntityFrameworkCore;
using Volo.Abp.AutoMapper;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Ord.Plugin.Auth
{
    [DependsOn(
         typeof(OrdDomainModule),
         typeof(AbpEntityFrameworkCoreModule)
         )]
    [DependsOn(
        typeof(OrdPluginAuthSharedModule),
        typeof(OrdPluginMasterDataSharedModule)
        )]
    public class OrdEfCoreDefaultModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdEfCoreDefaultModule>(validate: false);
            });
            services.AddAbpDbContext<OrdDefaultDbContext>(options =>
            {
                options.AddDefaultRepositories(includeAllEntities: true);
            });
            Configure<AbpDbContextOptions>(options =>
            {
                options.Configure(configurationContext => { configurationContext.UseMySQL(); });
            });
            Configure<AbpDbContextOptions>(options =>
            {
                options.Configure<OrdDefaultDbContext>(config =>
                {
                    config.UseMySQL(); // Hoặc UseMySql() tùy theo version
                });
            });
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(OrdEfCoreDefaultModule).Assembly));

        }

    }
}
