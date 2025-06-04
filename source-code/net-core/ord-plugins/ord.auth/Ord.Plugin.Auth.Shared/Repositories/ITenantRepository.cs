using Ord.Plugin.Auth.Shared.Entities;
using Volo.Abp.Domain.Repositories;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface ITenantRepository : IBasicRepository<TenantEntity, Guid>
    {
        Task<Guid?> GetIdByCode(string? tenantCode);
        Task<TenantEntity> GetByCode(string? tenantCode);
    }
}
