using Ord.Plugin.Contract.Dtos.Auth;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Core.Data;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Repositories
{
    public class PermissionSharedRepository(IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider)
        : DapperDefaultDbContext(dbContextProvider), IPermissionSharedRepository
    {
       
        public Task<IEnumerable<string>> GetRoleBasedPermissionsAsync(Guid userId)
        {
            var sql = $@"SELECT pg.PermissionName FROM UserRoles ur 
                        join PermissionGrants pg on ur.RoleId = pg.ProviderId and pg.ProviderName = 'R'
                        WHERE ur.UserId = @UserId";
            return QueryAsync<string>(sql, new
            {
                UserId = userId
            });
        }
        public Task<IEnumerable<UserPermissionGrantedDto>> GetDirectUserPermissionsAsync(Guid userId)
        {
            var sql = $@"SELECT UserId,PermissionName,IsGrant from PermissionUsers 
                    where UserId = @UserId";
            return QueryAsync<UserPermissionGrantedDto>(sql, new
            {
                UserId = userId
            });
        }
      

    }
}