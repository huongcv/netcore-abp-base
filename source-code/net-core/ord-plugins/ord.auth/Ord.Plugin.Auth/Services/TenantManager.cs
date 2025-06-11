using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Util;
using Ord.Plugin.Contract.Consts;

namespace Ord.Plugin.Auth.Services
{
    public class TenantManager(
        ITenantCrudRepository tenantCrudRepository,
        IUserCrudRepository userCrudRepository,
        IRoleCrudRepository roleCrudRepository) : OrdAuthManagerBase
    {
        public async Task CreateDefaultAdminUserAsync(Guid tenantId, string adminPassword)
        {
            using (CurrentTenant.Change(tenantId))
            {
                var adminUser = new UserEntity(GuidGenerator.Create())
                {
                    TenantId = tenantId,
                    UserName = "admin",
                    Name = "Administrator",
                    Email = "admin@tenant.local",
                    IsActived = true,
                    Level = UserConst.AdminTenantLevel,
                    MustChangePassword = true
                };

                adminUser.PasswordHash = UserUtil.HashPassword(adminUser, adminPassword);
                await userCrudRepository.InsertAsync(adminUser, autoSave: true);
            }
        }

        public async Task SetupDefaultRolesAndPermissionsAsync(Guid tenantId)
        {
            using (CurrentTenant.Change(tenantId))
            {
                // Create default Admin role
                var roleOfAdmin = new RoleEntity()
                {
                    TenantId = tenantId,
                    Code = "ADMIN",
                    Name = "Administrator",
                    Description = "Full system access role tenant",
                    IsActived = true
                };

                await roleCrudRepository.InsertAsync(roleOfAdmin, autoSave: true);

                // Create default User role
                var roleOfUser = new RoleEntity
                {
                    TenantId = tenantId,
                    Code = "USER",
                    Name = "User",
                    Description = "Basic user role tenant",
                    IsActived = true
                };

                await roleCrudRepository.InsertAsync(roleOfUser, autoSave: true);

                // Assign admin user to admin role
                //var adminUser = await userCrudRepository.GetQueryableAsync();
                //var admin = await adminUser.FirstOrDefaultAsync(x => x.UserName == "admin" && x.TenantId == tenantId);

                //if (admin != null)
                //{
                //    var userRole = new UserRoleEntity
                //    {
                //        TenantId = tenantId,
                //        UserId = admin.Id,
                //        RoleId = roleOfAdmin.Id
                //    };

                //    var userRoleRepo = AppFactory.GetServiceDependency<IRepository<UserRoleEntity, int>>();
                //    await userRoleRepo.InsertAsync(userRole, autoSave: true);
                //}
            }
        }

    }
}
