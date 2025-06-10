using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Dtos.Roles;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Localization;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Auth.Shared.Services;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Core.Services;

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
        protected override IStringLocalizer GetMainLocalizer()
        {
            return AppFactory.GetServiceDependency<IStringLocalizer<OrdAuthResource>>();
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

            return AppFactory.CreateSuccessResult(true, GetLocalizedMessage("role_assign_permissions_success"));
        }

        [HttpPost]
        public async Task<CommonResultDto<List<string>>> GetListPermission(EncodedIdDto input)
        {
            await CheckPermissionForOperation(CrudOperationType.Base);
            var roleId = ConvertEncodeId(input.EncodedId);
            return await AppFactory.CreateSuccessResultAsync(() => RoleCrudRepository.GetRolePermissionGrants(roleId));
        }


    }
}
