using Microsoft.Extensions.Caching.Distributed;
using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Services.Auth;
using System.Security.Claims;
using Volo.Abp.Caching;

namespace Ord.Plugin.HostBase.Services.Auth;

public class CheckAccessTokenRevokedService(IAppFactory appFactory) : ICheckAccessTokenService
{
    private const string RevokedTokenPrefix = "RevokeToken:";
    private const string ActiveTokenPrefix = "TokenValid:";

    private readonly IDistributedCache<string> _cache = appFactory.GetServiceDependency<IDistributedCache<string>>();
    private readonly IUserAccessTokenSharedRepository _userAccessRepo = appFactory.GetServiceDependency<IUserAccessTokenSharedRepository>();
    private readonly bool _isCheckRevokeEnabled = FullAppSettingConfig.GetInstance()?.Authentication?.IsCheckRevokeToken == true;

    public async Task<string> CheckClaims(IEnumerable<Claim>? claims)
    {
        if (!_isCheckRevokeEnabled || claims is null || !claims.Any())
        {
            return string.Empty;
        }
        var tokenId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
        var userId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(tokenId))
        {
            return string.Empty;
        }

        var revokedKey = RevokedTokenPrefix + tokenId;
        var activeKey = $"{ActiveTokenPrefix}{userId}:{tokenId}";

        if (!string.IsNullOrEmpty(await _cache.GetAsync(revokedKey)))
        {
            return "exception.access_token_revoked";
        }

        if (!string.IsNullOrEmpty(await _cache.GetAsync(activeKey)))
        {
            return string.Empty;
        }

        if (await _userAccessRepo.CheckAccessTokenInActive(tokenId))
        {
            CacheRevokedTokenAsync(revokedKey);
            return "exception.access_token_revoked";
        }

        if (!string.IsNullOrEmpty(userId))
        {
            CacheActiveTokenAsync(activeKey);
        }

        return string.Empty;
    }

    private Task CacheRevokedTokenAsync(string key) =>
        _cache.SetAsync(key, "1", new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(15)
        });

    private Task CacheActiveTokenAsync(string key) =>
        _cache.SetAsync(key, "1", new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
        });
}
