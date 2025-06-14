using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml.Style;
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
using System.Drawing;
using Ord.Plugin.Contract.Features.DataExporting;

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
        /// <summary>
        /// Lấy cấu hình export cho User
        /// </summary>
        protected override async Task<(
            Action<OrdExcelColumnBuilder<UserPagedDto>> ColumnBuilder,
            Action<OrdExcelConfigurationBuilder> ConfigurationBuilder,
            string FileName
            )> GetExportConfiguration(List<UserPagedDto> dataItems, UserPagedInput input)
        {
            // Column Builder cho User

            var columnBuilder = new Action<OrdExcelColumnBuilder<UserPagedDto>>(columns => columns
                .AddRowIndex()
                .AddColumn(c => c.WithBase(x => x.UserName, 30)
                    .WithBoldFont()
                    .WithWrapText())
                .AddColumn(c => c.WithBase(x => x.Name, 30, "FullName"))
                .AddColumn(c => c.WithBase(x => x.Email, 50))
                .AddColumn(c => c.WithBase(x => x.PhoneNumber, 20))
                .AddColumn(c => c.WithBase(x => x.CreationTime, 26).WithDateTimeFormat())
                .AddIsActiveColumn(x => x.IsActived));

            // Configuration Builder cho User
            var configurationBuilder = new Action<OrdExcelConfigurationBuilder>(config => config
                .DefaultConfig(AppFactory.GetLocalizedMessage("auth.user.list-user"))
                .WithPrintSettings(print => print
                    .WithHeader("HỆ THỐNG QUẢN LÝ NGƯỜI DÙNG")
                //.WithFooter("Trang {0} / {1}")
                )
                .WithCustomWorksheet(worksheet =>
                {
                    // Thêm thông tin tổng hợp ở cuối
                    var lastRow = worksheet.Dimension?.End.Row ?? 1;
                    var summaryRow = lastRow + 3;

                    worksheet.Cells[summaryRow, 1].Value = "Tổng số người dùng:";
                    worksheet.Cells[summaryRow, 1].Style.Font.Bold = true;
                    worksheet.Cells[summaryRow, 2].Value = dataItems.Count;

                    worksheet.Cells[summaryRow + 1, 1].Value = "Người dùng hoạt động:";
                    worksheet.Cells[summaryRow + 1, 1].Style.Font.Bold = true;
                    worksheet.Cells[summaryRow + 1, 2].Value = dataItems.Count(x => x.IsActived);

                    // Thêm border cho summary
                    var summaryRange = worksheet.Cells[summaryRow, 1, summaryRow + 1, 2];
                    summaryRange.Style.Border.BorderAround(ExcelBorderStyle.Medium);
                }));

            // File Name cho User
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var fileName = $"DanhSachNguoiDung_{timestamp}.xlsx";

            return (columnBuilder, configurationBuilder, fileName);
        }
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
