using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;

namespace Ord.Plugin
{
  
    public class OrdPluginMasterDataSharedModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAutoMapperObjectMapper<OrdPluginMasterDataSharedModule>();
            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<OrdPluginMasterDataSharedModule>(); // tên Assembly chứa Profile
            });
        }
    }
}
