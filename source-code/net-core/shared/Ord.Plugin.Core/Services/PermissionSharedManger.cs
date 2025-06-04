using Microsoft.Extensions.Configuration;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Services;
using Volo.Abp.Caching;

namespace Ord.Plugin.Core.Services
{
    public class PermissionSharedManger : IPermissionSharedManger
    {
        private readonly string _connString;
        private readonly IDistributedCache<IEnumerable<string>> _cache;
        private readonly IAppFactory _appFactory;
        public PermissionSharedManger(IConfiguration configuration,
            IDistributedCache<IEnumerable<string>> cache, IAppFactory appFactory)
        {
            _cache = cache;
            _appFactory = appFactory;
            _connString = configuration.GetConnectionString("Default");
        }

        public async Task<bool> IsGranted(Guid userId, string permissionName, bool isForce = false)
        {
            if (string.IsNullOrEmpty(permissionName))
            {
                return true;
            }

            if (isForce)
            {
                await _cache.RemoveAsync("AllPermissionGrantedUser:" + userId);
            }
            var allPermissionGranted = await GetListPermissionGranted(userId);
            return allPermissionGranted?.Any(x => string.Equals(x, permissionName, StringComparison.CurrentCultureIgnoreCase)) == true;
        }

        private Task<IEnumerable<string>?> GetListPermissionGranted(Guid userId)
        {
            return _cache.GetOrAddAsync("AllPermissionGrantedUser:" + userId, async () =>
            {
                return await DoGetPermissionsGranted(userId);
            });

        }

        private async Task<IEnumerable<string>?> DoGetPermissionsGranted(Guid userId)
        {
            var repos = _appFactory.GetServiceDependency<IPermissionSharedRepository>();
            var permissionsGranted = (await repos.GetRoleBasedPermissionsAsync(userId)).ToList() ?? new List<string>();
            var userGranted = await repos.GetDirectUserPermissionsAsync(userId);
            if (userGranted?.Any() == true)
            {
                foreach (var itemUserPermission in userGranted)
                {
                    var permissionName = itemUserPermission.PermissionName;
                    if (string.IsNullOrEmpty(permissionName)) continue;
                    if (itemUserPermission.IsGrant == true)
                    {
                        permissionsGranted.Add(permissionName);
                    }
                    else
                    {
                        permissionsGranted = permissionsGranted.Where(x => !string.Equals(x, permissionName, StringComparison.OrdinalIgnoreCase)).ToList();
                    }
                }
            }

            return permissionsGranted.Distinct().OrderByDescending(x => x).ToList();
        }


    }
}
