using Ord.Plugin.Auth.Shared.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface IUserRoleRepository : IBasicRepository<UserRoleEntity, int>
    {
        #region Basic User-Role Operations
        Task<bool> IsUserInRoleAsync(Guid userId, Guid roleId);
        Task AddUserToRoleAsync(Guid userId, Guid roleId);
        Task RemoveUserFromRoleAsync(Guid userId, Guid roleId);
        Task<List<Guid>> GetUserRoleIdsAsync(Guid userId);
        Task<List<Guid>> GetRoleUserIdsAsync(Guid roleId);
        Task<int> GetUserCountInRoleAsync(Guid roleId);
        Task<int> GetRoleCountForUserAsync(Guid userId);
        #endregion

        #region Bulk Operations
        Task AddUsersToRoleAsync(Guid roleId, List<Guid> userIds);
        Task RemoveUsersFromRoleAsync(Guid roleId, List<Guid> userIds);
        Task AssignRolesToUserAsync(Guid userId, List<Guid> roleIds);
        Task AddAdditionalRolesToUserAsync(Guid userId, List<Guid> roleIds);
        Task RemoveRolesFromUserAsync(Guid userId, List<Guid> roleIds);
        Task ReplaceUserRolesAsync(Guid userId, List<Guid> newRoleIds);
        Task ClearAllUsersFromRoleAsync(Guid roleId);
        Task ClearAllRolesFromUserAsync(Guid userId);
        #endregion
    }
}
