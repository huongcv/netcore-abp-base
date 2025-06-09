using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Factories;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    public class InformationAppService(IAppFactory appFactory) : OrdAuthAppService
    {
        [HttpGet]
        public async Task<AppBootstrapDto?> GetBootstrap()
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

        [HttpGet]
        [OrdAuth("test_permission")]
        public Task<string> Ping()
        {
            return Task.FromResult("pong");
        }
        [HttpPost]
        public Task<PagedResultDto<UserPagedDto>> GetUsers(UserPagedInput input)
        {
            var repo = AppFactory.GetServiceDependency<IUserCrudRepository>();
            return repo.GetPagedListAsync(input);
        }
        public Task<UserDetailDto> GetById(string encodeId)
        {
            var repo = AppFactory.GetServiceDependency<IUserCrudRepository>();
            return repo.GetDetailByEncodedIdAsync(encodeId);
        }
    }
}
