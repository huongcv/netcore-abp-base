using Ord.Contract.Entities;
using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Contract.Data;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserCrudRepository : IOrdCrudRepository<UserEntity, Guid, UserPagedInput, UserPagedDto, UserDetailDto, CreateUserDto, UpdateUserDto>
    {
        Task<IEnumerable<UserPagedDto>> GetListComboOptions(bool includeUnActive = false);
        Task<IEnumerable<Guid>> GetListRoleAssigned(Guid id);
        Task GrantPermissionForUser(Guid userId, string permissionName, bool isGranted);
    }
}
