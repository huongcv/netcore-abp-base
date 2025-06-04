using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services
{
    public interface IOrdPermissionCheckerService : IScopedDependency
    {
        Task<bool> IsGranted(Guid userId, string permissionName);
    }
}
