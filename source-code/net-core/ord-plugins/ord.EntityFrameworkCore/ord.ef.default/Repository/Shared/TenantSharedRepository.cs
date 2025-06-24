using Ord.Plugin.Contract.Dtos;
using Ord.Plugin.Contract.Repositories;
using System.Text;

namespace Ord.Plugin.Core.Repositories
{
    public class TenantSharedRepository(IAppFactory appFactory) : DapperDefaultDbRepository(appFactory), ITenantSharedRepository
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
