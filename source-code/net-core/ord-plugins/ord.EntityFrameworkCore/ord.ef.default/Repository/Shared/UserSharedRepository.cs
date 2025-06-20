﻿using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Core.Data;
using System.Text;

namespace Ord.Plugin.Core.Repositories
{
    public class UserSharedRepository(IAppFactory appFactory) : DapperDefaultDbRepository(appFactory), IUserSharedRepository
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

        public Task<IEnumerable<Guid>> GetUsersByTenantsAsync(Guid? tenantId)
        {
            var sql = new StringBuilder($@"SELECT Id from users where IsDeleted = 0 ");
            sql.AppendTenantFilter(tenantId);
            return QueryAsync<Guid>(sql.ToString(), new
            {
                TenantId = tenantId
            });
        }
        public Task<DateTime?> GetChangePasswordDateTime(string? userId)
        {
            var sql = new StringBuilder($@"select ChangePasswordDateTime from Users where id = @Id");
            return QueryFirstOrDefaultAsync<DateTime?>(sql.ToString(), new
            {
                Id = userId
            });
        }
    }
}
