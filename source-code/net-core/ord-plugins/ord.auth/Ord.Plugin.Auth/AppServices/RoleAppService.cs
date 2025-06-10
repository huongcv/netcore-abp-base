using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Ord.Plugin.Contract.Data;
using Ord.Plugin.Core.Services;

namespace Ord.Plugin.Auth.AppServices
{
    [OrdAuth]
    public class RoleAppService : OrdCrudAppService<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>
    {
        private IRoleCrudRepository RoleCrudRepository => AppFactory.GetServiceDependency<IRoleCrudRepository>();
        protected override IOrdCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto> CrudRepository => RoleCrudRepository;
        protected override string GetBasePermissionName()
        {
            return "AuthPlugin.Role";
        }
    }
}
