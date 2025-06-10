using Microsoft.Extensions.Localization;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdManagerBase : DomainService
    {
        protected IStringLocalizer L => GetMainLocalizer();
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        protected abstract IStringLocalizer GetMainLocalizer();
    }
}
