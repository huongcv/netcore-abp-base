using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;
using Volo.Abp.Application.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdAppServiceBase : ApplicationService
    {
        protected IStringLocalizer L => GetMainLocalizer();
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();

        protected virtual IStringLocalizer GetMainLocalizer()
        {
            return AppFactory.GetServiceDependency<IStringLocalizer<OrdLocalizationResource>>();
        }
    }
}
