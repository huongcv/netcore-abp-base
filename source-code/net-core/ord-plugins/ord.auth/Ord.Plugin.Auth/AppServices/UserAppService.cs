using Microsoft.AspNetCore.Mvc;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services.Security;
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
        private IUserManager UserManager => AppFactory.GetServiceDependency<IUserManager>();
        //[OrdAuth("AuthPlugin.User")]
        [HttpPost]
        [OrdAuth("AuthPlugin.User")]
        public async Task<CommonResultDto<PagedResultDto<UserPagedDto>>> GetPaged(UserPagedInput input)
        {
            var paged = await UserCrudRepository.GetPagedListAsync(input);
            return AppFactory.CreateSuccessResult(paged);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User")]
        public async Task<CommonResultDto<CounterByIsActivedDto>> GetCountByIsActived(UserPagedInput input)
        {
            return AppFactory.CreateSuccessResult(await UserCrudRepository.GetCountGroupByIsActivedAsync(input));
        }

        [HttpPost]
        [OrdAuth("AuthPlugin.User")]
        public async Task<CommonResultDto<UserDetailDto>> GetById(EncodedIdDto input)
        {
            var dto = await UserCrudRepository.GetDetailByEncodedIdAsync(input.EncodedId);
            return AppFactory.CreateSuccessResult(dto);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.Create")]
        public async Task<CommonResultDto<UserDetailDto>> CreateAsync(CreateUserDto input)
        {
            var createUser = await UserCrudRepository.CreateAsync(input);
            return AppFactory.CreateSuccessResult(AppFactory.ObjectMap<UserEntity, UserDetailDto>(createUser));
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.Update")]
        public async Task<CommonResultDto<UserDetailDto>> UpdateAsync(UpdateUserDto input)
        {
            var updatedUser = await UserCrudRepository.UpdateByEncodedIdAsync(input.EncodedId, input);
            if (updatedUser == null)
            {
                return CreateNotFoundResult<UserDetailDto>("crud_user_not_found");
            }
            return AppFactory.CreateSuccessResult(AppFactory.ObjectMap<UserEntity, UserDetailDto>(updatedUser));
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.Remove")]
        public async Task<CommonResultDto<bool>> RemoveAsync(EncodedIdDto input)
        {
            var ret = await UserCrudRepository.DeleteByEncodedIdAsync(input.EncodedId);
            if (!ret)
            {
                 return CreateNotFoundResult<bool>("crud_user_not_found");
            }
            return AppFactory.CreateSuccessResult(ret);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.UnLock")]
        public async Task<CommonResultDto<bool>> UnLock(EncodedIdDto input)
        {
            var userId = ConvertEncodeId(input.EncodedId);
            await UserManager.Unlock(userId);
            return AppFactory.CreateSuccessResult(true);
        }
        [HttpPost]
        [OrdAuth("AuthPlugin.User.ResetPassword")]
        public async Task<CommonResultDto<bool>> ResetPassword(ResetPasswordUserDto input)
        {
            var userId = ConvertEncodeId(input.EncodedId);
            await UserManager.ResetPasswordAsync(userId, input.NewPassword, input.MustChangePassword);
            return AppFactory.CreateSuccessResult(true);
        }
       
        protected Guid ConvertEncodeId(string encodeId)
        {
            var ser = AppFactory.GetServiceDependency<IIdEncoderService<UserEntity, Guid>>();
            return ser.DecodeId(encodeId);
        }
    }
}
