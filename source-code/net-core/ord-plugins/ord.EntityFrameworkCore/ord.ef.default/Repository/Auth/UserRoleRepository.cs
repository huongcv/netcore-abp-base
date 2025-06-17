using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Validation;

namespace Ord.Plugin.Auth.Repositories
{
    public class UserRoleRepository(IAppFactory factory)
        : OrdAuthBaseRepository<UserRoleEntity, int>(factory), IUserRoleRepository
    {

        #region Basic User-Role Operations

        public async Task<bool> IsUserInRoleAsync(Guid userId, Guid roleId)
        {
            var queryable = await GetUserRoleQueryable();
            return await queryable
                .AnyAsync(x => x.UserId == userId && x.RoleId == roleId);
        }

        public async Task AddUserToRoleAsync(Guid userId, Guid roleId)
        {
            if (await IsUserInRoleAsync(userId, roleId))
                return;

            var userRole = new UserRoleEntity
            {
                UserId = userId,
                RoleId = roleId,
                TenantId = AppFactory.CurrentTenantId
            };

            await InsertAsync(userRole);
            await LogUserRoleAssignmentAsync(userId, roleId, "Assigned");
        }

        public async Task RemoveUserFromRoleAsync(Guid userId, Guid roleId)
        {
            await DeleteAsync(x => x.UserId == userId && x.RoleId == roleId);
            await LogUserRoleAssignmentAsync(userId, roleId, "Removed");
        }

        public async Task<List<Guid>> GetUserRoleIdsAsync(Guid userId)
        {
            var queryable = await GetUserRoleQueryable();
            return await queryable
                .Where(x => x.UserId == userId)
                .Select(x => x.RoleId)
                .ToListAsync();
        }

        public async Task<List<Guid>> GetRoleUserIdsAsync(Guid roleId)
        {
            var queryable = await GetUserRoleQueryable();
            return await queryable
                .Where(x => x.RoleId == roleId)
                .Select(x => x.UserId)
                .ToListAsync();
        }

        public async Task<int> GetUserCountInRoleAsync(Guid roleId)
        {
            var queryable = await GetUserRoleQueryable();
            return await queryable
                .Where(x => x.RoleId == roleId)
                .CountAsync();
        }

        public async Task<int> GetRoleCountForUserAsync(Guid userId)
        {
            var queryable = await GetUserRoleQueryable();
            return await queryable
                .Where(x => x.UserId == userId)
                .CountAsync();
        }

        #endregion

        #region Bulk Operations

        public async Task AddUsersToRoleAsync(Guid roleId, List<Guid> userIds)
        {
            var existingUserIds = await GetRoleUserIdsAsync(roleId);
            var newUserIds = userIds.Except(existingUserIds).ToList();

            if (!newUserIds.Any())
                return;

            var userRoles = newUserIds.Select(userId => new UserRoleEntity
            {
                UserId = userId,
                RoleId = roleId,
                TenantId = AppFactory.CurrentTenantId
            }).ToList();

            await InsertManyAsync(userRoles);

            foreach (var userId in newUserIds)
            {
                await LogUserRoleAssignmentAsync(userId, roleId, "BulkAssigned");
            }
        }

        public async Task RemoveUsersFromRoleAsync(Guid roleId, List<Guid> userIds)
        {
            await DeleteAsync(x => x.RoleId == roleId && userIds.Contains(x.UserId));

            foreach (var userId in userIds)
            {
                await LogUserRoleAssignmentAsync(userId, roleId, "BulkRemoved");
            }
        }

        public async Task AssignRolesToUserAsync(Guid userId, List<Guid> roleIds)
        {
            roleIds ??= new();
            if (roleIds?.Any() == true)
            {
                // validate roleId
                foreach (var roleId in roleIds)
                {
                    if (!await ExistsEntityAsync<RoleEntity>(x => x.Id == roleId))
                    {
                        throw new AbpValidationException(AppFactory.GetLocalizedMessage("auth.role.not_found_id", roleId));
                    }
                }

            }
            var existingRoleIds = await GetUserRoleIdsAsync(userId);

            // Tìm các role cần xóa (cũ nhưng không còn trong danh sách mới)
            var rolesToRemove = existingRoleIds.Except(roleIds).ToList();
            // Tìm các role cần thêm (mới nhưng chưa có trong danh sách cũ)
            var rolesToAdd = roleIds.Except(existingRoleIds).ToList();

            // Xóa các role không còn
            if (rolesToRemove.Any())
            {
                await DeleteAsync(x => x.UserId == userId && rolesToRemove.Contains(x.RoleId));

                foreach (var removedRoleId in rolesToRemove)
                {
                    await LogUserRoleAssignmentAsync(userId, removedRoleId, "RemovedBeforeReassign");
                }
            }

            // Thêm các role mới
            if (rolesToAdd.Any())
            {
                var userRolesToAdd = rolesToAdd.Select(roleId => new UserRoleEntity
                {
                    UserId = userId,
                    RoleId = roleId,
                    TenantId = AppFactory.CurrentTenantId
                }).ToList();

                await InsertManyAsync(userRolesToAdd);

                foreach (var addedRoleId in rolesToAdd)
                {
                    await LogUserRoleAssignmentAsync(userId, addedRoleId, "AssignedInBulk");
                }
            }
        }

        public async Task AddAdditionalRolesToUserAsync(Guid userId, List<Guid> roleIds)
        {
            var existingRoleIds = await GetUserRoleIdsAsync(userId);
            var newRoleIds = roleIds.Except(existingRoleIds).ToList();

            if (!newRoleIds.Any())
                return;

            var userRoles = newRoleIds.Select(roleId => new UserRoleEntity
            {
                UserId = userId,
                RoleId = roleId,
                TenantId = AppFactory.CurrentTenantId
            }).ToList();

            await InsertManyAsync(userRoles);

            foreach (var roleId in newRoleIds)
            {
                await LogUserRoleAssignmentAsync(userId, roleId, "AdditionalRoleAssigned");
            }
        }
        public async Task RemoveRolesFromUserAsync(Guid userId, List<Guid> roleIds)
        {
            await DeleteAsync(x => x.UserId == userId && roleIds.Contains(x.RoleId));

            foreach (var roleId in roleIds)
            {
                await LogUserRoleAssignmentAsync(userId, roleId, "BulkRemoved");
            }
        }

        public async Task ReplaceUserRolesAsync(Guid userId, List<Guid> newRoleIds)
        {
            var existingRoleIds = await GetUserRoleIdsAsync(userId);

            // Remove roles not in new list
            var rolesToRemove = existingRoleIds.Except(newRoleIds).ToList();
            if (rolesToRemove.Any())
            {
                await RemoveRolesFromUserAsync(userId, rolesToRemove);
            }

            // Add new roles
            var rolesToAdd = newRoleIds.Except(existingRoleIds).ToList();
            if (rolesToAdd.Any())
            {
                await AssignRolesToUserAsync(userId, rolesToAdd);
            }
        }

        public async Task ClearAllUsersFromRoleAsync(Guid roleId)
        {
            var userIds = await GetRoleUserIdsAsync(roleId);
            await DeleteAsync(x => x.RoleId == roleId);

            foreach (var userId in userIds)
            {
                await LogUserRoleAssignmentAsync(userId, roleId, "ClearedFromRole");
            }
        }

        public async Task ClearAllRolesFromUserAsync(Guid userId)
        {
            var roleIds = await GetUserRoleIdsAsync(userId);
            await DeleteAsync(x => x.UserId == userId);

            foreach (var roleId in roleIds)
            {
                await LogUserRoleAssignmentAsync(userId, roleId, "ClearedFromUser");
            }
        }

        #endregion

        #region Audit log

        protected async Task LogUserRoleAssignmentAsync(Guid userId, Guid roleId, string action, string? reason = null)
        {
            try
            {
                // Get user and role information for logging
                var userQuery = await GetUserQueryable();
                var roleQuery = await GetRoleQueryable();
                var userName = await userQuery.Where(x => x.Id == userId).Select(x => x.UserName).FirstOrDefaultAsync();
                var roleName = await roleQuery.Where(x => x.Id == roleId).Select(x => x.Name).FirstOrDefaultAsync();
                var currentUser = AppFactory.CurrentUserId?.ToString() ?? "System";

                // Create log message
                var logMessage = $"User Role Assignment - Action: {action}, User: {userName} (ID: {userId}), Role: {roleName} (ID: {roleId})";
                if (!string.IsNullOrEmpty(reason))
                {
                    logMessage += $", Reason: {reason}";
                }
                logMessage += $", Modified By: {currentUser}, Tenant: {AppFactory.CurrentTenantId}";

                // Log using your preferred logging framework
                Logger.LogInformation(logMessage);

                // You can also log to database if needed
                // await LogToDatabase(userId, roleId, action, reason, currentUser);
            }
            catch (Exception ex)
            {
                // Don't throw exception from logging method to avoid breaking the main flow
                Logger.LogError(ex, "Failed to log user role assignment for User: {UserId}, Role: {RoleId}, Action: {Action}",
                    userId, roleId, action);
            }
        }

        #endregion

    }
}
