using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Utils;

namespace Ord.Plugin.Auth.AppServices
{
    public class InformationAppService(IAppFactory appFactory) : OrdAuthAppService
    {
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

        [HttpGet]
        [OrdAuth("test_permission")]
        public Task<string> Ping()
        {
            return Task.FromResult("pong");
        }
    }
}
