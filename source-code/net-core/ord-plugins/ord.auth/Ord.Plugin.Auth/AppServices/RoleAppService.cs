using Microsoft.AspNetCore.Mvc;
using Ord.Plugin.Auth.Repositories;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Roles;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;
using Ord.Plugin.Core.Utils;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class RoleAppService : OrdCrudAppService<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>
    {
        private IRoleCrudRepository RoleCrudRepository => AppFactory.GetServiceDependency<IRoleCrudRepository>();
        private IRoleManager RoleManager => AppFactory.GetServiceDependency<IRoleManager>();
        protected override IOrdCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto> CrudRepository => RoleCrudRepository;
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.Role";
        }

        protected override async Task OnAfterGetDetailAsync(RoleDetailDto dto)
        {
            dto.AssignedPermissions = await RoleCrudRepository.GetRolePermissionGrants(dto.Id);
        }

        [HttpPost]
        public async Task<CommonResultDto<bool>> AssignPermissions(AssignPermissionsToRoleDto input)
        {
            await CheckPermissionForActionName("SetPermission");
            var roleId = ConvertEncodeId(input.EncodedId);
            await RoleManager.AssignPermissionsToRoleAsync(roleId, input.PermissionNames ?? new List<string>());

            return AppFactory.CreateSuccessResult(true, AppFactory.GetLocalizedMessage("auth.role.assign_permissions_success"));
        }


        #region Read Operations
        [HttpPost]
        public async Task<CommonResultDto<List<string>>> GetRolePermissions(EncodedIdDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.GetDetail);
            var roleId = ConvertEncodeId(input.EncodedId);
            return await AppFactory.CreateSuccessResultAsync(() => RoleCrudRepository.GetRolePermissionGrants(roleId));
        }

        /// <summary>
        /// Lấy danh sách người dùng để chọn (combo/select)
        /// Value lấy Id chính
        /// </summary>
        [HttpPost]
        [ActionName("GetComboOptions")]
        public async Task<CommonResultDto<List<ComboOptionDto>>> GetComboOptions(GetComboOptionInputDto input)
        {
            var users = await RoleCrudRepository.GetListComboOptions(input.IncludeUnActive ?? false);
            var options = users.Select(x => new ComboOptionDto
            {
                Value = x.Id,
                DisplayName = x.Name,
                Data = new
                {
                    x.Id,
                    x.Name,
                    x.IsActived,
                    EncodedId = IdEncoderService.EncodeId(x.Id)
                }
            }).ToList();
            return AppFactory.CreateSuccessResult(options);
        }
        #endregion
        [HttpPost]
        public async Task<CommonResultDto<PagedResultDto<UserInRoleDto>>> GetUsersInRole(GetUsersInRoleInput input)
        {
            await CheckPermissionForOperation(CrudOperationType.GetDetail);
            var roleId = ConvertEncodeId(input.EncodedId);
            var result = await RoleCrudRepository.GetUsersInRoleAsync(roleId, input);
            return AppFactory.CreateSuccessResult(result);
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> AddUsersToRole(UsersToRoleDto input)
        {
            await CheckPermissionForActionName("AssignUsers");
            var roleId = ConvertEncodeId(input.EncodedId);
            var userRoleRepos = AppFactory.GetServiceDependency<IUserRoleRepository>();
            await userRoleRepos.AddUsersToRoleAsync(roleId, input.UserIds);
            foreach (var userId in input.UserIds)
            {
                await AppFactory.ClearCacheUser(userId);
            }
            return AppFactory.CreateSuccessResult(true, AppFactory.GetLocalizedMessage("auth.role.users_added_success"));
        }
        [HttpPost]
        public async Task<CommonResultDto<bool>> RemoveUsersFromRole(UsersToRoleDto input)
        {
            await CheckPermissionForActionName("AssignUsers");
            var roleId = ConvertEncodeId(input.EncodedId);
            var userRoleRepos = AppFactory.GetServiceDependency<IUserRoleRepository>();
            await userRoleRepos.RemoveUsersFromRoleAsync(roleId, input.UserIds);
            foreach (var userId in input.UserIds)
            {
                await AppFactory.ClearCacheUser(userId);
            }
            return AppFactory.CreateSuccessResult(true, AppFactory.GetLocalizedMessage("auth.role.users_removed_success"));
        }
    }
}
