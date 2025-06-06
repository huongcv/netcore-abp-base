using Ord.Contract.Entities;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Entities;
using Volo.Abp.Domain.Entities;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Base
{
    public class OrdAuthBaseRepository<TEntity, TKey> : OrdEfCoreRepository<OrdPluginAuthDbContext,TEntity, TKey>
        where TEntity : class, IEntity<TKey>
    {
        public OrdAuthBaseRepository(IDbContextProvider<OrdPluginAuthDbContext> dbContextProvider) : base(dbContextProvider)
        {
           var _dbContextProvider = LazyServiceProvider.LazyGetRequiredService<IDbContextProvider<OrdPluginAuthDbContext>>();
        } 
        
        protected  Task<IQueryable<TenantEntity>> GetTenantQueryable(bool isNoTracking = true)
        {
            return GetQueryableEntity<TenantEntity>();
        }
        protected Task<IQueryable<UserEntity>> GetUserQueryable(bool isNoTracking = true)
        {
            return GetQueryableEntity<UserEntity>();
        }
        protected Task<IQueryable<RoleEntity>> GetRoleQueryable(bool isNoTracking = true)
        {
            return GetQueryableEntity<RoleEntity>();
        }
        protected Task<IQueryable<UserRoleEntity>> GetUserRoleQueryable(bool isNoTracking = true)
        {
            return GetQueryableEntity<UserRoleEntity>();
        }
        protected Task<IQueryable<PermissionGrantEntity>> GetPermissionGrantQueryable(bool isNoTracking = true)
        {
            return GetQueryableEntity<PermissionGrantEntity>();
        }

        protected Task<IQueryable<PermissionUserEntity>> GetPermissionUserQueryable(bool isNoTracking = true)
        {
            return GetQueryableEntity<PermissionUserEntity>();
        }
        protected Task<IQueryable<SettingEntity>> GetSettingQueryable(bool isNoTracking = true)
        {
            return GetQueryableEntity<SettingEntity>();
        }
    }
}
