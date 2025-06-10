using Microsoft.Extensions.Localization;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Core.Base;

namespace Ord.Plugin.Auth.Base
{
    public class OrdAuthManagerBase : OrdManagerBase
    {
        protected IUserRepository UserRepos => AppFactory.GetServiceDependency<IUserRepository>();
        protected ITenantRepository TenantRepos => AppFactory.GetServiceDependency<ITenantRepository>();
        protected IRoleCrudRepository RoleRepos => AppFactory.GetServiceDependency<IRoleCrudRepository>();
        protected override IStringLocalizer GetMainLocalizer()
        {
            return AppFactory.GetServiceDependency<IStringLocalizer<OrdAuthResource>>();
        }
    }
}
