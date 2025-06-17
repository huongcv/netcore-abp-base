using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AutoMapper;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Ord.Plugin.Auth
{
    [DependsOn(
         typeof(OrdPluginMasterDataSharedModule)
         )]
    public class OrdPluginMasterDataModule : AbpModule
    {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            PreConfigure<AbpAspNetCoreMvcOptions>(options =>
            {
                options
                    .ConventionalControllers
                    .Create(typeof(OrdPluginMasterDataModule).Assembly, opts =>
                    {
                        opts.RootPath = "master-data";
                        opts.UrlActionNameNormalizer = normalizerContext => normalizerContext.Action.ActionName;
                    });
            });
        }
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdPluginMasterDataModule>(validate: false);
            });
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(OrdPluginMasterDataModule).Assembly));

        }

    }
}
