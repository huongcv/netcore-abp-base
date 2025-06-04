using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Contract.Localization;
using Volo.Abp.AutoMapper;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;

namespace Ord.Plugin
{
  
    public class OrdPluginAuthSharedModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {

            context.Services.AddAutoMapperObjectMapper<OrdPluginAuthSharedModule>();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdPluginAuthSharedModule>(); // tên Assembly chứa Profile
            });

            context.Services.AddValidatorsFromAssembly(typeof(OrdPluginAuthSharedModule).Assembly);

            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                // chú ý namespace của  OrdAuthResource là Ord.Plugin.Auth.Shared.Localization 
                // thì giá trị là Ord.Plugin.Auth.Shared
                options.FileSets.AddEmbedded<OrdPluginAuthSharedModule>("Ord.Plugin.Auth.Shared");
            });
            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Add<OrdAuthResource>("vi")
                    .AddBaseTypes(typeof(OrdLocalizationResource))
                    .AddBaseTypes(typeof(AbpValidationResource))
                    .AddVirtualJson("/Localization/OrdAuth");
            });
        }
    }
}
