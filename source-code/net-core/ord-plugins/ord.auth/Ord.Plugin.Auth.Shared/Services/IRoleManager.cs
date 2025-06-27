using Ord.Plugin.Auth.Shared.Dtos;
using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface IRoleManager : IDomainService
    {
        Task AssignPermissionsToRoleAsync(Guid roleId, IEnumerable<string> listOfPermissions);
        Task<IEnumerable<RoleDetailDto>> GetAssignableRolesAsync(Guid userId);
        Task AssignRoleAdminTenant(Guid userId);
    }
}
