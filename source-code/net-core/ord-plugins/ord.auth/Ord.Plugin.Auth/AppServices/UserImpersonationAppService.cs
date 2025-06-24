using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Shared.Dtos.Auths;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Base;

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
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.User";
        }
    }
}
