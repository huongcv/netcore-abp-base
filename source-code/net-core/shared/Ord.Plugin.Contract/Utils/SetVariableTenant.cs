namespace Ord.Plugin.Contract.Utils
{
    public static class GetConditionIsNullSql
    {
        public static string GetColTenant(string tableName, Guid? tenantId)
        {
            if (tenantId.HasValue)
            {
                return $@"{tableName}.TenantId = '{tenantId}'";
            }
            else
            {
                return $@"{tableName}.TenantId is null";
            }
        }
        public static string GetColShopId(string tableName, int? shopId)
        {
            if (shopId.HasValue)
            {
                return $@"{tableName}.ShopId = '{shopId}'";
            }
            return $@"{tableName}.ShopId is null";
        }
        public static string GetColTenantPrm(string tableName, Guid? tenantId)
        {
            if (tenantId.HasValue)
            {
                return $@"{tableName}.TenantId = @TenantId";
            }
            return $@"{tableName}.TenantId is null";
        }

    }
}
