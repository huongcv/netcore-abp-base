using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IRoleManager : IDomainService
    {
        Task AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<string> listOfPermissions);
    }
}
