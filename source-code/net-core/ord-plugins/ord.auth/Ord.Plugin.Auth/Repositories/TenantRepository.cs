using Microsoft.EntityFrameworkCore;
using Ord.Plugin.Auth.Base;
using Ord.Plugin.Auth.Data;
using Ord.Plugin.Auth.Shared.Entities;
using Ord.Plugin.Auth.Shared.Repositories;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Auth.Repositories
{
    public class TenantRepository(IDbContextProvider<OrdPluginAuthDbContext> dbContextProvider)
        : OrdAuthBaseRepository<TenantEntity, Guid>(dbContextProvider), ITenantRepository
    {
        public async Task<Guid?> GetIdByCode(string? tenantCode)
        {
            if (string.IsNullOrEmpty(tenantCode))
            {
                return null;
            }
            var queryable = await GetTenantQueryable();
            return await queryable.AsNoTracking()
                .Where(x => x.Code == tenantCode)
                .Select(x => x.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<TenantEntity> GetByCode(string? tenantCode)
        {
            var queryable = await GetTenantQueryable();
            return await queryable
                .Where(x => x.Code == tenantCode)
                .FirstOrDefaultAsync();
        }
    }
}
