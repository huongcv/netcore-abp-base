using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Core.Base;

namespace Ord.Plugin.Auth.Base
{
    public class OrdAuthManagerBase : OrdManagerBase
    {
        protected IUserRepository UserRepos => AppFactory.GetServiceDependency<IUserRepository>();
        protected ITenantRepository TenantRepos => AppFactory.GetServiceDependency<ITenantRepository>();
        protected IRoleCrudRepository RoleRepos => AppFactory.GetServiceDependency<IRoleCrudRepository>();
    }
}
