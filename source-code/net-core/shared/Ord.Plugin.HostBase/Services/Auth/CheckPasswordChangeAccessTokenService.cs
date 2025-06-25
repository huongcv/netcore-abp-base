using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Services.Auth;
using Ord.Plugin.Core.Utils;
using System.Security.Claims;
using Volo.Abp.Caching;
using Volo.Abp.Security.Claims;
using Volo.Abp.Uow;

namespace Ord.Plugin.HostBase.Services.Auth;

public class CheckPasswordChangeAccessTokenService(IAppFactory appFactory) : ICheckAccessTokenService
{
    private const string ChangePasswordCachePrefix = "ChangePasswordDateTime:";
    private const string ChangePwdByTokenPrefix = "ChangePwdByToken:";

    public async Task<string> CheckClaims(IEnumerable<Claim>? claims)
    {
        if (claims is null || !claims.Any())
        {
            return string.Empty;
        }

        var settings = FullAppSettingConfig.GetInstance();
        if (settings?.Authentication?.IsPasswordChangeMiddleware != true)
        {
            return string.Empty;
        }

        var context = appFactory.HttpContextAccessor().HttpContext;
        var cache = appFactory.LazyService<IDistributedCache<string>>();

        var tokenId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
        var userId = claims.FirstOrDefault(x => x.Type == AbpClaimTypes.UserId)?.Value;
        var tokenChangePwdDate = claims.FirstOrDefault(x => x.Type == OrdClaimsTypes.ChangePasswordDateTime)?.Value ?? "";

        if (string.IsNullOrEmpty(userId))
        {
            return "exception.access_token_invalid";
        }

        // Cho phép refresh token sau khi đổi mật khẩu, nếu đã được cache xác nhận
        if (context.Request.Path.ToString().ToLowerInvariant().Contains("auth/refresh-token") && !string.IsNullOrEmpty(tokenId))
        {
            var allowRefresh = await cache.GetAsync(ChangePwdByTokenPrefix + tokenId);
            if (!string.IsNullOrEmpty(allowRefresh))
            {
                return string.Empty;
            }
        }

        var cacheKey = ChangePasswordCachePrefix + userId;
        var storedChangePwdDate = await cache.GetOrAddAsync(cacheKey, () => GetChangePasswordDateTimeAsync(userId));

        if (!string.Equals(storedChangePwdDate, tokenChangePwdDate))
        {
            return "exception.access_token_invalid";
        }

        return string.Empty;
    }

    private async Task<string> GetChangePasswordDateTimeAsync(string userId)
    {
        var userRepo = appFactory.GetServiceDependency<IUserSharedRepository>();
        var uowManager = appFactory.GetServiceDependency<IUnitOfWorkManager>();

        using var uow = uowManager.Begin();
        var changeTime = await userRepo.GetChangePasswordDateTime(userId);
        await uow.CompleteAsync();

        return changeTime?.ToString(OrdClaimsTypes.FormatClaimDateType) ?? string.Empty;
    }
}
