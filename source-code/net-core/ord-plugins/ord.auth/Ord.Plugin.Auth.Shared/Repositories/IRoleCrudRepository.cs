using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Data;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IRoleCrudRepository : IOrdCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>
    {
    }
}
