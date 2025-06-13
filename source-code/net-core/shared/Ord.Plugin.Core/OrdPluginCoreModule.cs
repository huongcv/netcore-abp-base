using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Contract;
using Ord.Plugin.Contract.Services.Security;
using Ord.Plugin.Core.Configurations;
using Ord.Plugin.Core.Services.Security;
using Volo.Abp;
using Volo.Abp.Autofac;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;

namespace Ord.Plugin.Core
{
    [DependsOn(typeof(AbpAutoMapperModule),
        typeof(AbpAutofacModule),
        typeof(OrdPluginContractModule)
        )
    ]
    public class OrdPluginCoreModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            services.AddAuthenticationServices();
            services.AddFirebaseServices(configuration);
            services.AddDatabaseServices();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdPluginCoreModule>(validate: false);
            });
            services.AddScoped(typeof(IIdEncoderService<,>), typeof(IdEncoderService<,>));
            services.AddHttpContextAccessor();
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(OrdPluginCoreModule).Assembly));
           
            //Sync 24.1.47
            Syncfusion.Licensing.SyncfusionLicenseProvider.RegisterLicense("Ngo9BigBOggjHTQxAR8/V1NAaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjW31XcHBUQmNeVEx2Ww==");


        }
    }
}
