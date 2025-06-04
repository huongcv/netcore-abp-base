using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Services
{
    public interface IPermissionSharedManger : IScopedDependency
    {
        Task<bool> IsGranted(Guid userId, string permissionName, bool isForce = false);
    }
}
