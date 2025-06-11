using Volo.Abp.Domain.Services;

namespace Ord.Plugin.Auth.Shared.Services
{
    public interface ITenantManager : IDomainService
    {
        Task CreateDefaultAdminUserAsync(Guid tenantId, string adminPassword);
        Task SetupDefaultRolesAndPermissionsAsync(Guid tenantId);
    }
}
