using Ord.Plugin.Contract.Dtos.Auth;
using Ord.Plugin.Contract.Repositories;

namespace Ord.Plugin.Core.Repositories
{
    public class PermissionSharedRepository(IAppFactory appFactory) : DapperDefaultDbRepository(appFactory), IPermissionSharedRepository
    {
       
        public Task<IEnumerable<string>> GetRoleBasedPermissionsAsync(Guid userId)
        {
            var sql = $@"SELECT pg.PermissionName FROM user_roles ur 
                        join permission_grants pg on ur.RoleId = pg.ProviderId and pg.ProviderName = 'R'
                        WHERE ur.UserId = @UserId";
            return QueryAsync<string>(sql, new
            {
                UserId = userId
            });
        }
        public Task<IEnumerable<UserPermissionGrantedDto>> GetDirectUserPermissionsAsync(Guid userId)
        {
            var sql = $@"SELECT UserId,PermissionName,IsGrant from permission_users 
                    where UserId = @UserId";
            return QueryAsync<UserPermissionGrantedDto>(sql, new
            {
                UserId = userId
            });
        }
      

    }
}