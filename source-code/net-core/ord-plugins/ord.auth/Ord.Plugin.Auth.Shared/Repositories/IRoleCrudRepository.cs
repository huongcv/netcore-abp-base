using Ord.Plugin.Auth.Shared.Dtos;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Data;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IRoleCrudRepository : IOrdCrudRepository<RoleEntity, Guid, RolePagedInput, RolePagedDto, RoleDetailDto, CreateRoleDto, UpdateRoleDto>
    {
        Task ClearAllPermission(Guid id);
        Task AssignPermissionsToRoleAsync(Guid id, IEnumerable<string> listOfPermission);
        Task<List<string>> GetRolePermissionGrants(Guid roleId);
        Task<IQueryable<PermissionGrantEntity>> GetRolePermissionGrantsQueryableAsync(Guid roleId);
        Task<IEnumerable<RolePagedDto>> GetListComboOptions(bool includeUnActive = false);


        #region User Management
        Task<PagedResultDto<UserInRoleDto>> GetUsersInRoleAsync(Guid roleId, GetUsersInRoleInput input);
        //Task AddUserToRoleAsync(Guid roleId, Guid userId);
        //Task RemoveUserFromRoleAsync(Guid roleId, Guid userId);
        //Task AddUsersToRoleAsync(Guid roleId, List<Guid> userIds);
        //Task RemoveUsersFromRoleAsync(Guid roleId, List<Guid> userIds);
        //Task<bool> IsUserInRoleAsync(Guid userId, Guid roleId);
        //Task<List<Guid>> GetUserIdsInRoleAsync(Guid roleId);
        //Task<int> GetUserCountInRoleAsync(Guid roleId);
        //Task ClearAllUsersFromRoleAsync(Guid roleId);
        #endregion

    }
}
