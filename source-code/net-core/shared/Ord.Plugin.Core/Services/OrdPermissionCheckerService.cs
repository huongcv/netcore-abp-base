using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services;
using Volo.Abp.Caching;

namespace Ord.Plugin.Core.Services
{
    public class OrdPermissionCheckerService : IOrdPermissionCheckerService
    {
        private readonly string _connString;
        private readonly IDistributedCache<IEnumerable<string>> _cache;
        private readonly IAppFactory _appFactory;
        public OrdPermissionCheckerService(IConfiguration configuration,
            IDistributedCache<IEnumerable<string>> cache, IAppFactory appFactory)
        {
            _cache = cache;
            _appFactory = appFactory;
            _connString = configuration.GetConnectionString("Default");
        }

        public async Task<bool> IsGranted(Guid userId, string permissionName)
        {
            var allPermissionGranted = await GetListPermissionGranted(userId);
            return allPermissionGranted?.Any(x => string.Equals(x, permissionName, StringComparison.CurrentCultureIgnoreCase)) == true;
        }

        private Task<IEnumerable<string>?> GetListPermissionGranted(Guid userId)
        {
            return _cache.GetOrAddAsync("AllPermissionGrantedUser:" + userId, async () =>
            {
                await using var conn = new MySqlConnection(_connString);
                await conn.OpenAsync();
                var items = (await conn.QueryAsync<string>($@"
                        SELECT pg.PermissionName FROM UserRoles ur 
                        join PermissionGrants pg on ur.RoleId = pg.ProviderId and pg.ProviderName = @ProviderName
                        WHERE ur.UserId = @UserId", new
                {
                    UserId = userId,
                    ProviderName = PermissionGrantProviderName.Role
                })).ToList();

                var permissionOfShop = (await conn.QueryAsync<string>($@"
                    SELECT pg.PermissionName from system_user_shop us
                    join PermissionGrants pg on us.RoleId = pg.ProviderId and pg.ProviderName = @ProviderName
                    where us.UserId = @UserId", new
                {
                    UserId = userId,
                    ProviderName = PermissionGrantProviderName.Role
                })).ToList();
                if (permissionOfShop?.Any() == true)
                {
                    items.AddRange(permissionOfShop);
                }

                var userGranted = await conn.QueryAsync<UserPermissionGranted>($@"
                    SELECT UserId,PermissionName,IsGrant from PermissionUsers 
                    where UserId = @UserId",new
                {
                    UserId = userId
                });
                if (userGranted?.Any() == true)
                {
                    foreach (var itemUserPermission in userGranted)
                    {
                        var permissionName = itemUserPermission.PermissionName;
                        if (!string.IsNullOrEmpty(permissionName))
                        {
                            if (itemUserPermission.IsGrant == true)
                            {
                                items.Add(permissionName);
                            }
                            else
                            {
                                items = items.Where(x => !string.Equals(x, permissionName,StringComparison.OrdinalIgnoreCase)).ToList();
                            }
                        }
                    }

                    items = items.Distinct().ToList();
                }
                await conn.CloseAsync();
                return items;
            });

        }

        private class UserPermissionGranted
        {
            public Guid UserId { get; set; }
            public string PermissionName { get; set; }
            public bool IsGrant { get; set; }
        }
    }
}
