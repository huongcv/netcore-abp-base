using System.Text;
using Ord.Plugin.Contract.Factories;

namespace Ord.Plugin
{
    public static class SqlBuilderExtensions
    {
        public static StringBuilder AppendTenantFilter(this StringBuilder sql, Guid? tenantId)
        {
            if (tenantId == null)
            {
                sql.Append(" AND TenantId IS NULL");
            }
            else
            {
                sql.Append(" AND TenantId = @TenantId");
            }
            return sql;
        }
        public static StringBuilder AppendTenantFilter(this StringBuilder sql, IAppFactory appFactory)
        {
            var tenantId = appFactory.CurrentTenant?.Id;
            return AppendTenantFilter(sql, tenantId);
        }
    }
}
