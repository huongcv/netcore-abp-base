using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Application.Services;

namespace Ord.Plugin.Auth.AppServices
{
    public class InformationAppService(IAppFactory appFactory) : ApplicationService
    {
        [HttpGet]
        public async Task<AppBootstrapDto?> GetBoostrap()
        {
            var appBootstrapDto = new AppBootstrapDto();
            if (!appFactory.CurrentUserId.HasValue)
            {
                return appBootstrapDto;
            }
            appBootstrapDto.User = await GetCurrentUser();
            return appBootstrapDto;
        }

        [HttpGet]
        [OrdAuth]
        public Task<UserInformationDto> GetCurrentUser()
        {
            return appFactory.GetUserSessionAsync();
        }
    }
}
