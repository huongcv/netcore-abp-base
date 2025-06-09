using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Dtos;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    /// <summary>
    /// Quản lý người dùng (tenant)
    /// </summary>
    [OrdAuth]
    public class UserAppService : OrdAuthAppService
    {
        private IUserCrudRepository UserCrudRepository => AppFactory.GetServiceDependency<IUserCrudRepository>();
        //[OrdAuth("AuthPlugin.User")]
        [HttpPost]
        public async Task<CommonResultDto<PagedResultDto<UserPagedDto>>> GetPaged(UserPagedInput input)
        {
            var paged = await UserCrudRepository.GetPagedListAsync(input);
            return CreateSuccessResult(paged);
        }
        [HttpPost]
        public async Task<CommonResultDto<UserDetailDto>> GetById(GetByEncodeIdDto input)
        {
            var repo = AppFactory.GetServiceDependency<IUserCrudRepository>();
            var dto = await repo.GetDetailByEncodedIdAsync(input.EncodeId);
            return CreateSuccessResult(dto);
        }
    }
}
