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
        private IJwtManager JwtManager => AppFactory.GetServiceDependency<IJwtManager>();
        private IHttpContextAccessor HttpContextAccessor => AppFactory.GetServiceDependency<IHttpContextAccessor>();
        private ILoginFirebaseManager LoginFirebaseManager => AppFactory.GetServiceDependency<ILoginFirebaseManager>();
        public async Task<CommonResultDto<JwtDto>> Login(LoginInputDto input)
        {
            var result = await AuthManager.LoginAsync(input);
            if (result.IsSuccessful && result.Data != null)
            {
                await JwtManager.SetJwtCookie(result.Data);
                await SetFirebaseLogin(result.Data?.TenantId, result.Data.UserId, input.FireBase);
                return result;
            }
            return result;
        }
        [OrdAuth]
        public async Task Logout()
        {
            // Xóa cookie
            await JwtManager.ClearJwtCookie();
            await AuthManager.LogoutAsync();
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
