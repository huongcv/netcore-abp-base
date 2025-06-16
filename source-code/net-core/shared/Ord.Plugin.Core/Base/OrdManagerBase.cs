using Ord.Plugin.Contract.Factories;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Core.Base
{
    public abstract class OrdManagerBase : DomainService
    {
        protected IAppFactory AppFactory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
        protected IServiceProvider ServiceProvider => LazyServiceProvider.LazyGetRequiredService<IServiceProvider>();
    }
}
