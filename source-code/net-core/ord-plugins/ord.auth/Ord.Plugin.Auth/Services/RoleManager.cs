using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Services;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Services
{
    public class RoleManager(IRoleCrudRepository roleCrudRepository,
        IUserCrudRepository userCrudRepository
    ) : OrdAuthManagerBase, IRoleManager
    {
        public async Task AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<string> listOfPermissions)
        {
            await AppFactory.ValidateUserCanGrantPermissionsAsync(listOfPermissions);
            if (listOfPermissions?.Any() != true)
            {
                await roleCrudRepository.ClearAllPermission(roleId);
                return;
            }

            await roleCrudRepository.AssignPermissionsToRoleAsync(roleId, listOfPermissions);
            var permissionSharedSer = AppFactory.GetServiceDependency<IPermissionSharedManger>();
            await permissionSharedSer.ClearCacheWhenRoleChangePermissions(roleId);
        }

        public async Task<IEnumerable<RoleDetailDto>> GetAssignableRolesAsync(Guid userId)
        {
            var listRoleAvailable = new List<RoleDetailDto>();
            var userEnt = await userCrudRepository.GetByIdAsync(userId, true);
            var listRoleLocal = await roleCrudRepository.GetListAsync();
            if (listRoleLocal?.Any() == true)
            {
                listRoleAvailable.AddRange(listRoleLocal
                    .Select(x => AppFactory.ObjectMap<RoleEntity, RoleDetailDto>(x)));
            }
            // bổ sung logic theo dự án
            if (userEnt?.TenantId.HasValue == true)
            {
                var listRoleTemplateForUser = new List<RoleEntity>();
                if (listRoleTemplateForUser?.Any() == true)
                {
                    listRoleAvailable.AddRange(listRoleTemplateForUser
                        .Select(x => AppFactory.ObjectMap<RoleEntity, RoleDetailDto>(x)));
                }
            }

            foreach (var role in listRoleAvailable)
            {
                role.PermissionNames = await roleCrudRepository.GetRolePermissionGrants(role.Id);
            }

            return listRoleAvailable;
        }
    }
}
