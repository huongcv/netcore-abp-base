using Ord.Plugin.Contract.Factories;
using System.Text;
using Volo.Abp.MultiTenancy;

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
        public static string AddTenantFilter(this string baseSql, IAppFactory appFactory, string tableAlias = "")
        {
            var prefix = string.IsNullOrEmpty(tableAlias) ? "" : $"{tableAlias}.";
            var currentTenant = appFactory.CurrentTenant?.Id;

            if (currentTenant.HasValue)
            {
                return $"{baseSql} AND ({prefix}TenantId = @TenantId OR {prefix}TenantId IS NULL)";
            }

            return $"{baseSql} AND {prefix}TenantId IS NULL";
        }
    }
}
