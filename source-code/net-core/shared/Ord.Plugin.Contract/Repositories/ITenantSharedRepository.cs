using Ord.Plugin.Contract.Dtos;
using Volo.Abp.DependencyInjection;

namespace Ord.Plugin.Contract.Repositories
{
    public interface ITenantSharedRepository : IScopedDependency
    {
        Task<TenantSharedDto> GetById(Guid tenantId);
    }
}
