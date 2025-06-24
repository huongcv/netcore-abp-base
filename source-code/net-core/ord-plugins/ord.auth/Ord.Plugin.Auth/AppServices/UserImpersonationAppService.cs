using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Utils;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    [Route("api/auth/user-impersonation")]
    public class UserImpersonationAppService(IUserImpersonationManager userImpersonationManager) : OrdAppServiceBase
    {
        [HttpPost("login-as-user")]
        [OrdAuth("User.LoginPasswordless")]
        public async Task<CommonResultDto<bool>> LoginAsUserAsync([FromBody] LoginAsUserInputDto input)
        {
            var result = await userImpersonationManager.LoginAsUserAsync(input);
            return result.ConvertTo(jwt => !string.IsNullOrEmpty(jwt?.AccessToken));
        }
        /// <summary>
        /// Quay lại tài khoản admin ban đầu
        /// </summary>
        /// <param name="input">Return token</param>
        /// <returns>Token admin</returns>
        [HttpPost("return-to-admin")]
        public async Task<CommonResultDto<bool>> ReturnToAdminAsync()
        {
            var userClaims = AppFactory.HttpContextAccessor().HttpContext?.User.Claims;
            if (userClaims?.Any() != true)
            {
                return CommonResultDto<bool>.Failed(AppFactory.GetLocalizedMessage("common.UserImpersonation.AdminEncodedIdNotFound"));
            }

            var userAdminEncodedId = userClaims.FirstOrDefault(x => x.Type == OrdClaimsTypes.ReturnToAdminId);
            if (string.IsNullOrEmpty(userAdminEncodedId?.Value))
            {
                return CommonResultDto<bool>.Failed(AppFactory.GetLocalizedMessage("common.UserImpersonation.AdminEncodedIdNotFound"));
            }

            await userImpersonationManager.ReturnToAdminAsync(userAdminEncodedId.Value);
            return CommonResultDto<bool>.Ok(true);
        }
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.User";
        }
    }
}
