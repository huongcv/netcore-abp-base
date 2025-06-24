using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Filters;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Base;
using Ord.Plugin.Core.Utils;

namespace Ord.Plugin.Auth.AppServices
{
    public class InformationAppService(IAppFactory appFactory) : OrdAppServiceBase
    {
        private IUserManager UserManager => AppFactory.GetServiceDependency<IUserManager>();
        [HttpGet]
        [AutoRefreshJwt]
        public async Task<CommonResultDto<AppBootstrapDto>> GetBootstrap()
        {
            var appBootstrapDto = new AppBootstrapDto();
            if (!appFactory.CurrentUserId.HasValue)
            {
                return AppFactory.CreateSuccessResult(appBootstrapDto);
            }
            appBootstrapDto.User = await DoGetCurrentUser();
            appBootstrapDto.UserCurrent = await GetUserCurrentAsync();
            return AppFactory.CreateSuccessResult(appBootstrapDto);
        }
        [HttpGet]
        [OrdAuth]
        public async Task<CommonResultDto<UserInformationDto>> GetCurrentUser()
        {
            var user = await DoGetCurrentUser();
            return appFactory.CreateSuccessResult(user);
        }
        [NonAction]
        protected Task<UserInformationDto> DoGetCurrentUser()
        {
            return appFactory.GetUserSessionAsync();
        }
        [NonAction]
        private async Task<AppUserCurrentDto> GetUserCurrentAsync()
        {
            var userCurrent = new AppUserCurrentDto();
            var httpContext = AppFactory.HttpContextAccessor()?.HttpContext;
            if (httpContext != null)
            {
                var claims = httpContext.User.Claims;
                userCurrent.IsLoginImpersonation = claims.Any(x => x.Type == OrdClaimsTypes.IsLoginImpersonation);
            }
            return userCurrent;
        }
        /// <summary>
        /// Người dùng đổi mật khẩu của mình 
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        [OrdAuth]
        public async Task<CommonResultDto<bool>> ChangePasswordAsync(ChangePasswordUserDto input)
        {
            var userId = AppFactory.CurrentUserId.Value;
            await UserManager.ChangePasswordAsync(userId, input.CurrentPassword, input.NewPassword);
            return AppFactory.CreateSuccessResult(true);
        }
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.Information";
        }
    }
}
