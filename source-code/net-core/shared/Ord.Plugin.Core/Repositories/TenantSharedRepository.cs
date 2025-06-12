using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Repositories;
using Ord.Plugin.Core.Data;
using System.Text;
using Volo.Abp.EntityFrameworkCore;

namespace Ord.Plugin.Core.Repositories
{
    public class TenantSharedRepository(IDbContextProvider<OrdPluginCoreDbContext> dbContextProvider)
        : DapperDefaultDbRepository(dbContextProvider), ITenantSharedRepository
    {
        public Task<TenantSharedDto> GetById(Guid tenantId)
        {
            var sql = new StringBuilder($@"select Id,`Name`,`Code`,IsActived,Email,PhoneNumber,Address
            from tenants where Id = @Id");
            sql.AppendTenantFilter(AppFactory);
            return  QueryFirstOrDefaultAsync<TenantSharedDto>(sql.ToString(), new
            {
                Id = tenantId
            });
        }
    }
}
