using Microsoft.IdentityModel.JsonWebTokens;
using Ord.Domain.Enums;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Configurations;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Contract.Services.Auth;
using System.Net;
using System.Security.Claims;
using Volo.Abp.Caching;

namespace Ord.Plugin.HostBase.Middlewares.Jwt
{
    public class CheckTokenRevokeMiddlewareService : ICheckClaimTokenJwtMiddlewareService
    {
        private readonly IAppFactory _appFactory;

        public CheckTokenRevokeMiddlewareService(IAppFactory appFactory)
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
            if (allSetting?.Authentication?.IsCheckRevokeToken != true)
            {
                var tokenId = claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value;
                if (!string.IsNullOrEmpty(tokenId))
                {
                    var _cache = _appFactory.LazyService<IDistributedCache<string>>();
                    var cacheData = await _cache.GetAsync("RevokeToken:" + tokenId);
                    if (!string.IsNullOrEmpty(cacheData))
                    {
                        return HttpStatusCode.Unauthorized;
                    }
                    var userAccessRepos = _appFactory.GetServiceDependency<IUserAccessTokenSharedRepository>();
                    var isTokenInActive = await userAccessRepos.CheckAccessTokenInActive(tokenId);
                    if (isTokenInActive)
                    {
                        _ = Task.Run(async () =>
                        {
                            await _cache.SetAsync("RevokeToken:" + tokenId, "1");
                        });
                        return HttpStatusCode.Unauthorized;
                    }
                }
            }
            return HttpStatusCode.OK;
        }
    }
}
