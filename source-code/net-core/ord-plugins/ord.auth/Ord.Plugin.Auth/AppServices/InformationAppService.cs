using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Utils;

namespace Ord.Plugin.Auth.AppServices
{
    public class InformationAppService(IAppFactory appFactory) : OrdAuthAppService
    {
        private IUserManager UserManager => AppFactory.GetServiceDependency<IUserManager>();
        [HttpGet]
        public async Task<CommonResultDto<AppBootstrapDto>> GetBootstrap()
        {
            var appBootstrapDto = new AppBootstrapDto();
            if (!appFactory.CurrentUserId.HasValue)
            {
                return AppFactory.CreateSuccessResult(appBootstrapDto);
            }
            appBootstrapDto.User = await DoGetCurrentUser();
            return AppFactory.CreateSuccessResult(appBootstrapDto);
        }
        [HttpGet]
        [OrdAuth]
        protected async Task<CommonResultDto<UserInformationDto>> GetCurrentUser()
        {
            var user = await DoGetCurrentUser();
            return appFactory.CreateSuccessResult(user);
        }
        [NonAction]
        protected Task<UserInformationDto> DoGetCurrentUser()
        {
            return appFactory.GetUserSessionAsync();
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
            await UserManager.ChangePasswordAsync(userId, input.OldPassword, input.NewPassword);
            return AppFactory.CreateSuccessResult(true);
        }

        [HttpGet]
        [OrdAuth("test_permission")]
        public Task<string> Ping()
        {
            return Task.FromResult("pong");
        }
    }
}
