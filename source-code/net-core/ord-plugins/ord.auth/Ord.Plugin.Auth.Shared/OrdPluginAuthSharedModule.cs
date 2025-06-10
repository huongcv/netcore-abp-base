using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.AutoMapper;
using Volo.Abp.Modularity;

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
        }
    }
}
