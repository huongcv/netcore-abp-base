﻿using Microsoft.AspNetCore.Identity;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Services;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Services
{
    public class RoleManager(IRoleCrudRepository roleCrudRepository) : OrdAuthManagerBase, IRoleManager
    {
        public async Task AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<string> listOfPermissions)
        {
            await ValidateUserCanGrantPermissionsAsync(listOfPermissions);
            if (listOfPermissions?.Any() != true)
            {
                await roleCrudRepository.ClearAllPermission(roleId);
                return;
            }

            await roleCrudRepository.AssignPermissionsToRoleAsync(roleId, listOfPermissions);
            var permissionSharedSer = AppFactory.GetServiceDependency<IPermissionSharedManger>();
            await permissionSharedSer.ClearCacheWhenRoleChangePermissions(roleId);
        }

        protected async Task ValidateUserCanGrantPermissionsAsync(IEnumerable<string> listOfPermissions)
        {
            var userSession = await AppFactory.GetUserSessionAsync();
            if (userSession == null)
            {
                throw new AbpValidationException(AppFactory.GetLocalizedMessage("common.user_session_not_found"));
            }
            var listPermission = userSession.ListPermission;
            if (listPermission?.Any() != true)
            {
                throw new AbpValidationException(AppFactory.GetLocalizedMessage("common.user_has_no_permissions"));
            }
            foreach (var permissionName in listOfPermissions)
            {
                if (listPermission?.Any(s => string.Equals(s, permissionName, StringComparison.OrdinalIgnoreCase)) != true)
                {
                    throw new AbpValidationException(AppFactory.GetLocalizedMessage("common.user_missing_permissions", permissionName));
                }
            }

        }
    }
}
