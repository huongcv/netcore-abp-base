using Microsoft.AspNetCore.Mvc;
using Ord.Contract.Entities;
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
        public async Task<CommonResultDto<CounterByIsActivedDto>> GetCountByIsActived(UserPagedInput input)
        {
            return CreateSuccessResult(await UserCrudRepository.GetCountGroupByIsActived(input));
        }

        [HttpPost]
        public async Task<CommonResultDto<UserDetailDto>> GetById(EncodeIdDto input)
        {
            var dto = await UserCrudRepository.GetDetailByEncodedIdAsync(input.EncodeId);
            return CreateSuccessResult(dto);
        }
        [HttpPost]
        public async Task<CommonResultDto<UserDetailDto>> CreateAsync(CreateUserDto input)
        {
            var createUser = await UserCrudRepository.CreateAsync(input);
            return CreateSuccessResult(AppFactory.ObjectMap<UserEntity, UserDetailDto>(createUser));
        }
        [HttpPost]
        public async Task<CommonResultDto<UserDetailDto>> UpdateAsync(UpdateUserDto input)
        {
            var updatedUser = await UserCrudRepository.UpdateByEncodedIdAsync(input.EncodedId, input);
            if (updatedUser == null)
            {
                return CreateNotFoundResult<UserDetailDto>(GetLocalizedMessage("crud_user_not_found"));
            }
            return CreateSuccessResult(AppFactory.ObjectMap<UserEntity, UserDetailDto>(updatedUser));
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> RemoveAsync(EncodeIdDto input)
        {
            var ret = await UserCrudRepository.DeleteByEncodedIdAsync(input.EncodeId);
            if (!ret)
            {
                return CreateNotFoundResult<bool>(GetLocalizedMessage("crud_user_not_found"));
            }
            return CreateSuccessResult(ret);
        }
    }
}
