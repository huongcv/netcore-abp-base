using Ord.Plugin.Contract.Factories;
using Volo.Abp.Application.Services;

namespace Ord.Plugin.Auth.Base
{
    public class OrdAuthAppService : ApplicationService
    {
        protected IAppFactory Factory => LazyServiceProvider.LazyGetRequiredService<IAppFactory>();
    }
}
