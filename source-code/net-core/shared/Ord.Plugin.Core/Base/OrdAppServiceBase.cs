using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Localization;
using Volo.Abp.Application.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdAppServiceBase : ApplicationService
    {
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
    }
}
