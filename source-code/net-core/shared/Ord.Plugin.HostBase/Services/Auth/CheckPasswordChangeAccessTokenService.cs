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

namespace Ord.Plugin.HostBase.Services.Auth
{
    public class CheckPasswordChangeAccessTokenService(IAppFactory appFactory) : ICheckAccessTokenService
    {
        public async Task<string> CheckClaims(IEnumerable<Claim>? claims)
        {
            if (claims?.Any() != true)
            {
                return string.Empty;
            }
            var allSetting = FullAppSettingConfig.GetInstance();
            if (allSetting?.Authentication?.IsPasswordChangeMiddleware != true)
            {
                return string.Empty;
            }

            var context = appFactory.HttpContextAccessor().HttpContext;
            // cho phép refresh token lại đối với người đổi mật khẩu
            if (context.Request.Path.ToString().ToLower().Contains("auth/refresh-token"))
            {
                var cache = appFactory.LazyService<IDistributedCache<string>>();
                var tokenId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
                var cacheDataChangePwdByToken = await cache.GetAsync("ChangePwdByToken:" + tokenId);
                if (!string.IsNullOrEmpty(cacheDataChangePwdByToken))
                {
                    return string.Empty;
                }
            }
            var changePasswordDateTime = claims.FirstOrDefault(x => x.Type == OrdClaimsTypes.ChangePasswordDateTime)?.Value ?? "";
            var userId = claims.FirstOrDefault(x => x.Type == AbpClaimTypes.UserId)?.Value;
            var _cache = appFactory.LazyService<IDistributedCache<string>>();
            var cacheData = await _cache.GetOrAddAsync("ChangePasswordDateTime:" + userId, () => DoGetChangePasswordDateTime(userId));
            if (!string.Equals(cacheData, changePasswordDateTime))
            {
                return "exception.access_token_invalid";
            }
            return string.Empty;
        }

        private async Task<string> DoGetChangePasswordDateTime(string? userId)
        {
            var userSer = appFactory.GetServiceDependency<IUserSharedRepository>();
            var uowManager = appFactory.GetServiceDependency<IUnitOfWorkManager>();
            using var uow = uowManager.Begin();
            var changeTime = await userSer.GetChangePasswordDateTime(userId);
            await uow.CompleteAsync();
            return changeTime.HasValue ? changeTime.Value.ToString(OrdClaimsTypes.FormatClaimDateType) : "";
        }
    }
}
