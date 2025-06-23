using Microsoft.AspNetCore.Identity;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Auth.Util;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Services
{
    public class UserManager(IUserCrudRepository userCrudRepository,
        IRoleCrudRepository roleCrudRepos) : OrdAuthManagerBase, IUserManager
    {
        public async Task ResetPasswordAsync(Guid userId, string newPassword, bool mustChangePassword = true)
        {
            var userEnt = await GetById(userId);
            userEnt.PasswordHash = UserUtil.HashPassword(userEnt, newPassword);
            userEnt.MustChangePassword = mustChangePassword;
            await AppFactory.ClearCacheUser(userId);
        }

        public async Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            var userEnt = await GetById(userId);
            var verifyOldPassword = UserUtil.VerifyPassword(userEnt, oldPassword);
            if (verifyOldPassword != PasswordVerificationResult.Success)
            {
                throw new AbpValidationException("old_password_invalid");
            }
            userEnt.PasswordHash = UserUtil.HashPassword(userEnt, newPassword);
            await AppFactory.ClearCacheUser(userId);
        }

        public async Task Unlock(Guid userId)
        {
            var userEnt = await GetById(userId);
            userEnt.LockoutEnd = null;
            await userCrudRepository.UpdateAsync(userEnt);
            await AppFactory.ClearCacheUser(userId);
        }

        public async Task AssignRoles(Guid userId, List<Guid> assignedRoleIds, List<string>? submittedPermissions)
        {
            var user = await GetById(userId);
            await AppFactory.ValidateUserCanGrantPermissionsAsync(submittedPermissions);
            var userRoleRepository = AppFactory.GetServiceDependency<IUserRoleRepository>();
            await userRoleRepository.AssignRolesToUserAsync(userId, assignedRoleIds);

            var rolePermissionNames = new List<string>();
            if (assignedRoleIds?.Any() == true)
            {
                rolePermissionNames = await roleCrudRepos.GetRolePermissionGrants(assignedRoleIds) ?? new();
                rolePermissionNames = rolePermissionNames.Distinct().ToList();
            }
            var userPermissionRepository = AppFactory.GetServiceDependency<IUserPermissionGrantedRepository>();
            await userPermissionRepository.DeleteByUserId(userId);

            var permissionEntities = new List<PermissionUserEntity>();

            // Những quyền do người dùng gửi lên nhưng không nằm trong quyền của các role → gán thủ công (IsGrant = true)
            if (submittedPermissions?.Any() == true)
            {
                var manuallyGrantedPermissions = submittedPermissions
                    .Where(permission => !rolePermissionNames.Contains(permission, StringComparer.OrdinalIgnoreCase))
                    .Distinct()
                    .Select(permission => new PermissionUserEntity()
                    {
                        UserId = userId,
                        PermissionName = permission,
                        IsGrant = true
                    });

                permissionEntities.AddRange(manuallyGrantedPermissions);
            }

            // Những quyền nằm trong role nhưng người dùng không chọn → bỏ quyền (IsGrant = false)
            var revokedRolePermissions = rolePermissionNames
                .Where(permission => submittedPermissions?.Any(p => string.Equals(p, permission, StringComparison.OrdinalIgnoreCase)) != true)
                .Distinct()
                .Select(permission => new PermissionUserEntity()
                {
                    UserId = userId,
                    PermissionName = permission,
                    IsGrant = false
                });

            permissionEntities.AddRange(revokedRolePermissions);

            await userPermissionRepository.InsertMany(permissionEntities);
            await AppFactory.ClearCacheUser(userId);
        }
        protected async Task<UserEntity> GetById(Guid userId)
        {
            var userEnt = await userCrudRepository.GetByIdAsync(userId);
            if (userEnt == null)
            {
                throw new EntityNotFoundException("message.not_found");
            }

            return userEnt;
        }
        public async Task<string> GenerateRandomPassword(Guid userId)
        {
            var newPassword = GenerateRandomPasswordString();
            await ResetPasswordAsync(userId, newPassword, mustChangePassword: true);
            return newPassword;
        }
        private string GenerateRandomPasswordString()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz@#$";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 12)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
