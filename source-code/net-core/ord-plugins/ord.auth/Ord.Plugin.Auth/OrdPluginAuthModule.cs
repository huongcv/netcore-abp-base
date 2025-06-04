using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Contract;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AutoMapper;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Guids;
using Volo.Abp.Modularity;

namespace Ord.Plugin.Auth
{
    [DependsOn(
         typeof(AbpEntityFrameworkCoreModule),
         typeof(OrdPluginContractModule),
         typeof(OrdPluginAuthSharedModule)
         )]
    public class OrdPluginAuthModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            PreConfigure<AbpAspNetCoreMvcOptions>(options =>
            {
                options
                    .ConventionalControllers
                    .Create(typeof(OrdPluginAuthModule).Assembly, opts =>
                    {
                        opts.RootPath = "auth-plugin";
                        opts.UrlActionNameNormalizer = normalizerContext => normalizerContext.Action.ActionName;
                    });
            });
        }
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            Configure<AbpSequentialGuidGeneratorOptions>(options =>
            {
                options.DefaultSequentialGuidType = SequentialGuidType.SequentialAsBinary;
            });
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdPluginAuthModule>(validate: false);
            });
            services.AddAbpDbContext<OrdPluginAuthDbContext>(options =>
            {
                options.AddDefaultRepositories(includeAllEntities: true);
            });

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(OrdPluginAuthModule).Assembly));

        }

    }
}
