using Microsoft.AspNetCore.Mvc;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;

namespace Ord.Plugin.Auth.AppServices
{
    /// <summary>
    /// Quản lý người dùng (tenant)
    /// </summary>
    [OrdAuth]
    public class UserAppService : OrdCrudAppService<UserEntity, Guid, UserPagedInput, UserPagedDto, UserDetailDto, CreateUserDto, UpdateUserDto>
    {
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.User";
        }
        private IUserCrudRepository UserCrudRepository => AppFactory.GetServiceDependency<IUserCrudRepository>();
        private IUserManager UserManager => AppFactory.GetServiceDependency<IUserManager>();
        protected override IOrdCrudRepository<UserEntity, Guid, UserPagedInput, UserPagedDto, UserDetailDto, CreateUserDto, UpdateUserDto> CrudRepository => UserCrudRepository;

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
    }
}
