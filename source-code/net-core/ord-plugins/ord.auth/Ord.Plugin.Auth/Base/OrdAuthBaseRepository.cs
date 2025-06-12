using Ord.Contract.Entities;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Domain.Entities;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Base
{
    public class OrdAuthBaseRepository<TEntity, TKey>(IAppFactory appFactory)
        : OrdEfCoreRepository<OrdPluginAuthDbContext, TEntity, TKey>(appFactory.GetServiceDependency<IDbContextProvider<OrdPluginAuthDbContext>>())
        where TEntity : class, IEntity<TKey>
    {
        protected Task<IQueryable<TenantEntity>> GetTenantQueryable(bool isNoTracking = true)
        {
            return GetEntityQueryable<TenantEntity>();
        }
        protected Task<IQueryable<UserEntity>> GetUserQueryable(bool isNoTracking = true)
        {
            return GetEntityQueryable<UserEntity>();
        }
        protected Task<IQueryable<RoleEntity>> GetRoleQueryable(bool isNoTracking = true)
        {
            return GetEntityQueryable<RoleEntity>();
        }
        protected Task<IQueryable<UserRoleEntity>> GetUserRoleQueryable(bool isNoTracking = true)
        {
            return GetEntityQueryable<UserRoleEntity>();
        }
        protected Task<IQueryable<PermissionGrantEntity>> GetPermissionGrantQueryable(bool isNoTracking = true)
        {
            return GetEntityQueryable<PermissionGrantEntity>();
        }

        protected Task<IQueryable<PermissionUserEntity>> GetPermissionUserQueryable(bool isNoTracking = true)
        {
            return GetEntityQueryable<PermissionUserEntity>();
        }
        protected Task<IQueryable<SettingEntity>> GetSettingQueryable(bool isNoTracking = true)
        {
            return GetEntityQueryable<SettingEntity>();
        }
    }
}
