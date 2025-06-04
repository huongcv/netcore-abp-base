using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services
{
    public interface IPermissionSharedManger : IScopedDependency
    {
        Task<IEnumerable<string>> GetPermissionsAsync(Guid userId);
        Task<IEnumerable<string>> GetCurrentUserPermissionsAsync();
        Task<bool> IsGranted(Guid userId, string permissionName, bool isForce = false);
        Task ClearCacheAsync(Guid userId);
        Task ClearCacheWhenRoleChangePermissions(Guid roleId);
    }
}
