using Microsoft.Extensions.Caching.Distributed;
using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Services.Auth;
using System.Security.Claims;
using Volo.Abp.Caching;

namespace Ord.Plugin.HostBase.Services.Auth
{
    public class CheckAccessTokenRevokedService(IAppFactory appFactory) : ICheckAccessTokenService
    {
        public async Task<string> CheckClaims(IEnumerable<Claim>? claims)
        {
            if (claims?.Any() != true)
            {
                return string.Empty;
            }
            var allSetting = FullAppSettingConfig.GetInstance();
            if (allSetting?.Authentication?.IsCheckRevokeToken != true)
            {
                return string.Empty;
            }
            var tokenId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
            if (!string.IsNullOrEmpty(tokenId))
            {
                var _cache = appFactory.LazyService<IDistributedCache<string>>();
                var cacheData = await _cache.GetAsync("RevokeToken:" + tokenId);
                if (!string.IsNullOrEmpty(cacheData))
                {
                    return "exception.access_token_revoked";
                }
                var userAccessRepos = appFactory.GetServiceDependency<IUserAccessTokenSharedRepository>();
                var isTokenInActive = await userAccessRepos.CheckAccessTokenInActive(tokenId);
                if (isTokenInActive)
                {
                    _ = Task.Run(async () =>
                    {
                        await _cache.SetAsync("RevokeToken:" + tokenId, "1", new DistributedCacheEntryOptions()
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    });
                    return "exception.access_token_revoked";
                }
            }
            return string.Empty;
        }
    }
}
