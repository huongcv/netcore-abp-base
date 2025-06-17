namespace Ord.Plugin.Auth.Repositories
{
    public class TenantRepository(IAppFactory factory)
        : DefaultBaseRepository<TenantEntity, Guid>(factory), ITenantRepository
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
