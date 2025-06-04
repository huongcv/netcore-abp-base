using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Services.Auth;
using System.Net;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Caching;
using Volo.Abp.Security.Claims;

namespace Ord.Plugin.HostBase.Middlewares
{
    public class CheckPasswordChangeTokenMiddlewareService : ICheckClaimTokenJwtMiddlewareService
    {
        private readonly IAppFactory _appFactory;

        public CheckPasswordChangeTokenMiddlewareService(IAppFactory appFactory)
        {
            _appFactory = appFactory;
        }

        public async Task<HttpStatusCode> CheckClaims(IEnumerable<Claim>? claims)
        {
            if (claims?.Any() != true)
            {
                return HttpStatusCode.OK;
            }
            var allSetting = FullAppSettingConfig.GetInstance();
            if (allSetting?.Authentication?.IsPasswordChangeMiddleware != true)
            {
                return HttpStatusCode.OK;
            }

            var context = _appFactory.HttpContextAccessor().HttpContext;
            // cho phép refresh token lại đối với người đổi mật khẩu
            if (context.Request.Path.ToString().ToLower().Contains("auth/refresh-token"))
            {
                var cache = _appFactory.LazyService<IDistributedCache<string>>();
                var tokenId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
                var cacheDataChangePwdByToken = await cache.GetAsync("ChangePwdByToken:" + tokenId);
                if (!string.IsNullOrEmpty(cacheDataChangePwdByToken))
                {
                    return HttpStatusCode.OK;
                }
            }
            var changePasswordDateTime = claims.FirstOrDefault(x => x.Type == OrdClaimsTypes.ChangePasswordDateTime)?.Value ?? "";
            var userId = claims.FirstOrDefault(x => x.Type == AbpClaimTypes.UserId)?.Value;
            var _cache = _appFactory.LazyService<IDistributedCache<string>>();
            var cacheData = await _cache.GetOrAddAsync("ChangePasswordDateTime:" + userId, async () =>
            {
                var changePasswordDateTime = await _appFactory.DapperDefaultDb.QueryFirstOrDefaultAsync<DateTime?>(
                    "select ChangePasswordDateTime from Users where id = @id", new
                    {
                        id = userId
                    });
                return changePasswordDateTime.HasValue ? changePasswordDateTime.Value.ToString(OrdClaimsTypes.FormatClaimDateType) : "";
            });
            if (!string.Equals(cacheData, changePasswordDateTime))
            {
                return HttpStatusCode.Unauthorized;
            }
            return HttpStatusCode.OK;
        }
    }
}
