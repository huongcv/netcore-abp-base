using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Dtos.Auth;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Core.Data;
using System.Text;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Repositories
{
    public class UserSharedRepository(IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider)
        : DapperDefaultDbRepository(dbContextProvider), IUserSharedRepository
    {
        public async Task<UserInformationDto?> GetById(Guid userId)
        {
            var sql = new StringBuilder($@"select Id,TenantId,UserName,Email,PhoneNumber,Name,IsActived,
            Level,IsLockoutEnabled,LockoutEnd,MustChangePassword,LastModificationTime
            from Users where Id = @Id");
            var currentTenantId = CurrentTenant?.Id;
            sql.AppendTenantFilter(AppFactory);
            return await QueryFirstOrDefaultAsync<UserInformationDto>(sql.ToString(), new
            {
                Id = userId,
                TenantId = currentTenantId
            });
        }
        public Task<IEnumerable<Guid>> GetUsersGrantedRole(Guid roleId)
        {
            var sql = $@"SELECT ur.UserId FROM UserRoles ur  WHERE ur.RoleId = @RoleId";
            return QueryAsync<Guid>(sql, new
            {
                RoleId = roleId
            });
        }
    }
}
