using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Services;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Caching;

namespace Ord.Plugin.Core.Services
{
    public class PermissionSharedManger(
        IDistributedCache<IEnumerable<string>> cache,
        IAppFactory appFactory)
        : IPermissionSharedManger
    {
        public Task<IEnumerable<string>> GetPermissionsAsync(Guid userId)
        {
            var cacheKey = GetCacheKey(userId);
            return cache.GetOrAddAsync(cacheKey, () => DoGetPermissionsGranted(userId));
        }

        public async Task<IEnumerable<string>> GetCurrentUserPermissionsAsync()
        {
            var userId = appFactory.CurrentUserId;
            if (!userId.HasValue)
            {
                return new List<string>();
            }
            return await GetPermissionsAsync(userId.Value);
        }

        public async Task<bool> IsGranted(Guid userId, string permissionName, bool isForce = false)
        {
            if (string.IsNullOrWhiteSpace(permissionName))
            {
                return true;
            }
            if (isForce)
            {
                await ClearCacheAsync(userId);
            }

            var permissions = await GetPermissionsAsync(userId);
            return permissions?.Contains(permissionName, StringComparer.OrdinalIgnoreCase) == true;
        }

        public Task ClearCacheAsync(Guid userId)
        {
            var cacheKey = GetCacheKey(userId);
            return cache.RemoveAsync(cacheKey);
        }

        public async Task ClearCacheWhenRoleChangePermissions(Guid roleId)
        {
            var listUserId = await appFactory.GetServiceDependency<IUserSharedRepository>().GetUsersGrantedRole(roleId);
            if (listUserId?.Any() == true)
            {
                foreach (var userId in listUserId)
                {
                    await ClearCacheAsync(userId);
                }
            }
        }

        private async Task<IEnumerable<string>> DoGetPermissionsGranted(Guid userId)
        {
            var repo = appFactory.GetServiceDependency<IPermissionSharedRepository>();

            var grantedPermissions = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            var rolePermissions = await repo.GetRoleBasedPermissionsAsync(userId);
            if (rolePermissions != null)
            {
                foreach (var perm in rolePermissions)
                    grantedPermissions.Add(perm);
            }

            var userPermissions = await repo.GetDirectUserPermissionsAsync(userId);
            if (userPermissions != null)
            {
                foreach (var userPerm in userPermissions)
                {
                    var name = userPerm.PermissionName;
                    if (string.IsNullOrWhiteSpace(name))
                        continue;

                    if (userPerm.IsGrant)
                        grantedPermissions.Add(name);
                    else
                        grantedPermissions.Remove(name);
                }
            }

            return grantedPermissions.OrderBy(x => x);
        }

        private string GetCacheKey(Guid userId) => appFactory.BuilderUserKeyCache(userId, "permission_granted");
    }
}
