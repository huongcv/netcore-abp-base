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
        public async Task<CommonResultDto<UserDetailDto>> GetById(EncodedIdDto input)
        {
            var dto = await UserCrudRepository.GetDetailByEncodedIdAsync(input.EncodedId);
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
        public async Task<CommonResultDto<bool>> RemoveAsync(EncodedIdDto input)
        {
            var ret = await UserCrudRepository.DeleteByEncodedIdAsync(input.EncodedId);
            if (!ret)
            {
                return CreateNotFoundResult<bool>(GetLocalizedMessage("crud_user_not_found"));
            }
            return CreateSuccessResult(ret);
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> UnLock(EncodedIdDto input)
        {
            var userId = ConvertEncodeId(input.EncodedId);
            await UserManager.Unlock(userId);
            return CreateSuccessResult(true);
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> ResetPassword(ResetPasswordUserDto input)
        {
            var userId = ConvertEncodeId(input.EncodedId);
            await UserManager.ResetPasswordAsync(userId, input.NewPassword, input.MustChangePassword);
            return CreateSuccessResult(true);
        }
        /// <summary>
        /// Người dùng đổi mật khẩu của mình 
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<CommonResultDto<bool>> ChangePasswordAsync(ChangePasswordUserDto input)
        {
            var userId = AppFactory.CurrentUserId.Value;
            await UserManager.ChangePasswordAsync(userId, input.OldPassword, input.NewPassword);
            return CreateSuccessResult(true);
        }
        protected Guid ConvertEncodeId(string encodeId)
        {
            var ser = AppFactory.GetServiceDependency<IIdEncoderService<UserEntity, Guid>>();
            return ser.DecodeId(encodeId);
        }
    }
}
