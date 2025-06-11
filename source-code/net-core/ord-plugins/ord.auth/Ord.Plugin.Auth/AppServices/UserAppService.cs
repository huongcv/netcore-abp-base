using Microsoft.AspNetCore.Mvc;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Services;
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



        #region Read Operations

        /// <summary>
        /// Lấy danh sách người dùng để chọn (combo/select)
        /// Value lấy Id chính
        /// </summary>
        [HttpPost]
        [ActionName("GetComboOptions")]
        public async Task<CommonResultDto<List<ComboOptionDto>>> GetComboOptions(GetComboOptionInputDto input)
        {
            var users = await UserCrudRepository.GetListComboOptions(input.IncludeUnActive ?? false);
            var options = users.Select(x => new ComboOptionDto
            {
                Value = x.Id,
                DisplayName = x.Name,
                Data = new
                {
                    x.Id,
                    x.PhoneNumber,
                    x.Email,
                    x.Name,
                    x.UserName,
                    x.IsActived,
                    EncodedId = IdEncoderService.EncodeId(x.Id)
                }
            }).ToList();
            return AppFactory.CreateSuccessResult(options);
        }
        #endregion

        #region  User Management
        [HttpPost]
        [OrdAuth("UnLock")]
        public async Task<CommonResultDto<bool>> UnLock(EncodedIdDto input)
        {
            await CheckPermissionForActionName("Unlock");
            var userId = ConvertEncodeId(input.EncodedId);
            await UserManager.Unlock(userId);
            return AppFactory.CreateSuccessResult(true);
        }
        /// <summary>
        /// Admin reset mật khẩu cho người dùng
        /// </summary>
        [HttpPost]
        [OrdAuth]
        public async Task<CommonResultDto<bool>> ResetPassword(ResetPasswordUserDto input)
        {
            await CheckPermissionForActionName("ResetPassword");
            var userId = ConvertEncodeId(input.EncodedId);
            await UserManager.ResetPasswordAsync(userId, input.NewPassword, input.MustChangePassword);
            return AppFactory.CreateSuccessResult(true);
        }


        #endregion

        #region Role Management

        /// <summary>
        /// Lấy danh sách roles của người dùng
        /// </summary>
        [HttpPost]
        public async Task<CommonResultDto<IEnumerable<Guid>>> GetUserRoles(EncodedIdDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.GetDetail);
            var userId = ConvertEncodeId(input.EncodedId);
            var lstRoleId = await UserCrudRepository.GetListRoleAssigned(userId);
            return AppFactory.CreateSuccessResult(lstRoleId);
        }
        /// <summary>
        /// Gán roles cho người dùng
        /// </summary>
        [HttpPost]
        public async Task<CommonResultDto<bool>> AssignRoles(AssignRolesToUserDto input)
        {
            await CheckPermissionForActionName("AssignRoles");
            var userId = ConvertEncodeId(input.EncodedId);
            await UserManager.AssignRoles(userId, input.RoleIds);
            return AppFactory.CreateSuccessResult(true, GetEntityNamePrefix() + ".assign_roles_success");
        }
        #endregion

        #region Permission Management


        /// <summary>
        /// Lấy permissions của người dùng
        /// </summary>
        [HttpPost]
        public async Task<CommonResultDto<IEnumerable<string>>> GetUserPermissions(EncodedIdDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.GetDetail);
            var userId = ConvertEncodeId(input.EncodedId);
            var permissionManager = AppFactory.GetServiceDependency<IPermissionSharedManger>();
            var permissions = await permissionManager.GetPermissionsAsync(userId);
            return AppFactory.CreateSuccessResult(permissions);
        }
        /// <summary>
        /// Gán permission trực tiếp cho người dùng
        /// </summary>
        [HttpPost]
        public async Task<CommonResultDto<bool>> GrantPermission(GrantPermissionToUserDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Update);
            return AppFactory.CreateSuccessResult(true, GetEntityNamePrefix() + ".grant_permission_success");
        }
        /// <summary>
        /// Thu hồi permission của người dùng
        /// </summary>
        [HttpPost]
        public async Task<CommonResultDto<bool>> RevokePermission(RevokePermissionFromUserDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Update);
            return AppFactory.CreateSuccessResult(true, GetEntityNamePrefix() + ".revoke_permission_success");
        }
        #endregion
    }
}
