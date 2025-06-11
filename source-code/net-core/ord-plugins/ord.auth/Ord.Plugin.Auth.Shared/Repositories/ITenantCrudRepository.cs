using Ord.Plugin.Auth.Shared.Dtos.Tenants;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Contract.Data;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Auth.Shared.Repositories
{
    public interface ITenantCrudRepository : IOrdCrudRepository<TenantEntity, Guid, TenantPagedInput, TenantPagedDto, TenantDetailDto, CreateTenantDto, UpdateTenantDto>
    {
        Task<bool> IsCodeUniqueAsync(string code, Guid? excludeId = null);
        Task<bool> IsEmailUniqueAsync(string email, Guid? excludeId = null);
        Task<IEnumerable<TenantPagedDto>> GetListComboOptions(bool includeUnActive = false);
        Task<TenantEntity?> GetByCodeAsync(string code);
        Task<bool> HasUsersAsync(Guid tenantId);
        Task<PagedResultDto<TenantUserDto>> GetPagedUsersByTenantIdAsync(Guid tenantId, TenantUserPagedInput input);
    }
}
