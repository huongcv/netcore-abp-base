using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Domain;
using Volo.Abp.Guids;
using Volo.Abp.Modularity;

namespace Ord.Plugin.Auth
{
    [DependsOn(typeof(AbpDddDomainModule))]
    public class OrdDomainModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            var services = context.Services;
            var configuration = context.Services.GetConfiguration();
            Configure<AbpSequentialGuidGeneratorOptions>(options =>
            {
                options.DefaultSequentialGuidType = SequentialGuidType.SequentialAsBinary;
            });
        }

    }
}
