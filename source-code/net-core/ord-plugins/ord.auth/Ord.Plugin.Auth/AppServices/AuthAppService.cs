using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Base;
using System.Net.Http;
namespace Ord.Plugin.Auth.AppServices
{
    public class AuthAppService : OrdAppServiceBase
    {
        private IAuthManager AuthManager => AppFactory.GetServiceDependency<IAuthManager>();
        private IHttpContextAccessor HttpContextAccessor => AppFactory.GetServiceDependency<IHttpContextAccessor>();
        private ILoginFirebaseManager LoginFirebaseManager => AppFactory.GetServiceDependency<ILoginFirebaseManager>();
        public async Task<CommonResultDto<JwtDto>> Login(LoginInputDto input)
        {
            var result = await AuthManager.LoginAsync(input);
            if (result.IsSuccessful && result.Data != null)
            {
                SetJwtCookie(result.Data, result.Data.ExpireInSeconds);
                await SetFirebaseLogin(result.Data?.TenantId, result.Data.UserId, input.FireBase);
                return result;
            }
            return result;
        }
        [OrdAuth]
        public Task Logout()
        {
            // Xóa cookie
            ClearJwtCookie();
            return AuthManager.LogoutAsync();
        }
        private void SetJwtCookie(JwtDto jwtDto, int expireInSeconds)
        {
            var httpContext = HttpContextAccessor.HttpContext;
            if (httpContext == null) return;
            var isHttps = httpContext.Request.IsHttps;
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // Cookie chỉ có thể truy cập từ server, không thể truy cập từ JavaScript
                Secure = isHttps,
                SameSite = SameSiteMode.Strict, // Bảo vệ khỏi CSRF attacks
                Expires = DateTimeOffset.UtcNow.AddSeconds(expireInSeconds),
                Path = "/" // Cookie có hiệu lực cho toàn bộ ứng dụng
            };

            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7), //  refresh token sống 7 ngày
                Path = "/"
            };

            HttpContextAccessor.HttpContext?.Response.Cookies.Append("jwt", jwtDto.AccessToken, cookieOptions);
            HttpContextAccessor.HttpContext?.Response.Cookies.Append("refresh_token", jwtDto.RefreshToken, refreshTokenOptions);
        }

        private async Task SetFirebaseLogin(Guid? tenantId, Guid userId, FireBaseDto fireBaseDto)
        {
            if (!string.IsNullOrEmpty(fireBaseDto?.FireBaseToken))
            {
                using (CurrentTenant.Change(tenantId))
                {
                    try
                    {
                        await LoginFirebaseManager.HandleFirebaseTokenOnLoginAsync(userId, fireBaseDto);
                    }
                    catch (Exception ex)
                    {
                        Logger.LogError(ex, $"Failed to handle Firebase token during login for user {userId} with firebasetoke {fireBaseDto.FireBaseToken}");
                    }
                }

            }
        }

        private void ClearJwtCookie()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(-1), // Set thời gian quá khứ để xóa cookie
                Path = "/"
            };

            HttpContextAccessor.HttpContext?.Response.Cookies.Append("jwt", "", cookieOptions);
        }

        protected override string GetBasePermissionName()
        {
            return "";
        }
    }
}
