using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Volo.Abp.Application.Services;
namespace Ord.Plugin.Auth.AppServices
{
    public class AuthAppService(IAppFactory appFactory) : ApplicationService
    {
        private IAuthManager AuthManager => appFactory.GetServiceDependency<IAuthManager>();
        private IHttpContextAccessor HttpContextAccessor => appFactory.GetServiceDependency<IHttpContextAccessor>();
        private ILoginFirebaseManager LoginFirebaseManager => appFactory.GetServiceDependency<ILoginFirebaseManager>();
        public async Task<CommonResultDto<JwtDto>> Login(LoginInputDto input)
        {
            var result = await AuthManager.LoginAsync(input);
            if (result.IsSuccessful && result.Data != null)
            {
                SetJwtCookie(result.Data.AccessToken, result.Data.ExpireInSeconds);
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
        private void SetJwtCookie(string token, int expireInSeconds)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // Cookie chỉ có thể truy cập từ server, không thể truy cập từ JavaScript
                Secure = false, // Chỉ gửi cookie qua HTTPS (đặt false cho development nếu dùng HTTP)
                SameSite = SameSiteMode.Strict, // Bảo vệ khỏi CSRF attacks
                Expires = DateTimeOffset.UtcNow.AddSeconds(expireInSeconds),
                Path = "/" // Cookie có hiệu lực cho toàn bộ ứng dụng
            };

            HttpContextAccessor.HttpContext?.Response.Cookies.Append("jwt", token, cookieOptions);
        }

        private async Task SetFirebaseLogin(Guid? tenantId,Guid userId,FireBaseDto fireBaseDto)
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
    }
}
