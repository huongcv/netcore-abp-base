using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Attributes;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Base;

namespace Ord.Plugin.Auth.AppServices
{
    [Route("api/auth")]
    public class AuthAppService : OrdAppServiceBase
    {
        private IAuthManager AuthManager => AppFactory.GetServiceDependency<IAuthManager>();
        private IJwtManager JwtManager => AppFactory.GetServiceDependency<IJwtManager>();
        private ILoginFirebaseManager LoginFirebaseManager => AppFactory.GetServiceDependency<ILoginFirebaseManager>();

        [HttpPost("login")]
        [IgnoreJwtCheck]
        public async Task<CommonResultDto<JwtDto>> Login(LoginInputDto input)
        {
            var result = await AuthManager.LoginAsync(input);
            if (result.IsSuccessful && result.Data != null)
            {
                await SetFirebaseLogin(result.Data?.TenantId, result.Data.UserId, input.FireBase);
                return result;
            }
            return result;
        }
        [HttpPost("logout")]
        [IgnoreJwtCheck]
        public async Task Logout()
        {
            if (AppFactory?.CurrentUserId.HasValue == true)
            {
                await AuthManager.LogoutAsync();
            }
            // Xóa cookie
            await JwtManager.ClearJwtCookie();
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
        protected override string GetBasePermissionName()
        {
            return "";
        }
    }
}
