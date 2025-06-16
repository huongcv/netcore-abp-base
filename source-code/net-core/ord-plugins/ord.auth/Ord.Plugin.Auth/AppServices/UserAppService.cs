using Microsoft.AspNetCore.Mvc;
using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Features.DataExporting.EpplusExporting;
using Ord.Plugin.Contract.Services;
using Ord.Plugin.Core.Services;
using Ord.Plugin.Core.Utils;

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

        protected override async Task OnAfterUpdateAsync(UserEntity entity, UserDetailDto dto)
        {
            await AppFactory.ClearCacheUser(entity.Id);
        }

        #region Export excel
        protected override async Task ConfigureExportAsync(EpplusExportingConfigurationBuilder config, List<UserPagedDto> dataItems, UserPagedInput input)
        {
            var columnBuilder = new Action<OrdExcelColumnBuilder<UserPagedDto>>(columns => columns
                .AddRowIndex()
                .AddColumn(c => c.WithBase(x => x.UserName, 30)
                    .WithBoldFont()
                    .WithWrapText())
                .AddColumn(c => c.WithBase(x => x.Name, 30, "FullName"))
                .AddColumn(c => c.WithBase(x => x.Email, 50))
                .AddColumn(c => c.WithBase(x => x.PhoneNumber, 20))
                .AddColumn(c => c.WithBase(x => x.CreationTime, 26).WithDateTimeFormat())
                .AddColumn(c => c.WithStatusSwitchCase(x => x.IsActived))
            );
            config.WithWorksheetName(AppFactory.GetLocalizedMessage("auth.user.list-user"))
                .WithTitle(EpplusExportingConfigurationUtils.MainTitle(AppFactory.GetLocalizedMessage("auth.user.list-user"),
                    2))
                .WithTitle(EpplusExportingConfigurationUtils.SubTitle("Ngày " + DateTime.Now.ToString("dd/MM/yyyy"),
                    3))
                .WithDataTable<UserPagedDto>(dt => dt
                    .WithRowIndexStart(5)
                    .WithHeaderStyle(EpplusExportingConfigurationUtils.DefaultHeaderStyle())
                    .WithDataStyle(EpplusExportingConfigurationUtils.DefaultDataStyle())
                    .WithColumns(columnBuilder)
                )
                .WithLandscapeOrientation();
        }

        protected override string GetExportFileName(UserPagedInput input)
        {
            return FileNameHelper.GenerateFileNameExcelWithTimestamp("DanhSachNguoiDung");
        }
        #endregion


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


        #region  User Management
        [HttpPost]
        [OrdAuth("UnLock")]
        public async Task<CommonResultDto<bool>> UnLock(EncodedIdDto input)
        {
            await CheckPermissionForActionName("Unlock");
            var userId = await GetUserIdAndClearCache(input.EncodedId);
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
            var userId = await GetUserIdAndClearCache(input.EncodedId);
            await UserManager.AssignRoles(userId, input.RoleIds);
            return AppFactory.CreateSuccessResult(true, GetMessagePrefix() + ".assign_roles_success");
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
            return await DoGrantPermission(input.EncodedId, input.PermissionName, false);
        }
        /// <summary>
        /// Thu hồi permission của người dùng
        /// </summary>
        [HttpPost]
        public async Task<CommonResultDto<bool>> RevokePermission(RevokePermissionFromUserDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Update);
            return await DoGrantPermission(input.EncodedId, input.PermissionName, false);
        }

        protected async Task<CommonResultDto<bool>> DoGrantPermission(string encodeUserId, string permissionName, bool isGranted)
        {
            var userId = await GetUserIdAndClearCache(encodeUserId);
            var checkPermissionName = await AppFactory.CheckPermissionAsync(permissionName);
            if (!checkPermissionName)
            {
                return AppFactory.CreateBadRequestResult<bool>(GetMessagePrefix() + ".error.user_not_permission_name");
            }
            await UserCrudRepository.GrantPermissionForUser(userId, permissionName, isGranted);
            var message = isGranted ? "grant_permission_success" : "revoke_permission_success";
            return AppFactory.CreateSuccessResult(true, GetMessagePrefix() + message);
        }
        private async Task<Guid> GetUserIdAndClearCache(string encodedId)
        {
            var userId = ConvertEncodeId(encodedId);
            await AppFactory.ClearCacheUser(userId);
            return userId;
        }
        #endregion
    }
}
