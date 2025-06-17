using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Ord.Plugin.Contract.Data
{
    public class FullAuditTenantMayShopEntity : FullAuditedEntity<long>, IMultiTenant
    {
        public FullAuditTenantMayShopEntity()
        {

        }
        public FullAuditTenantMayShopEntity(long id) : base(id)
        {

        }
        public Guid? TenantId { get; set; }
        public int? ShopId { get; set; }
    }
    public class FullAuditShopEntity : FullAuditShopEntity<long>
    {
        public FullAuditShopEntity()
        {

        }
        public FullAuditShopEntity(long id) : base(id)
        {

        }
    }
    public class FullAuditShopEntity<TKey> : FullAuditedEntity<TKey>, IMultiShop, IMultiTenant
    {
        public int? ShopId { get; set; }
        public Guid? TenantId { get; set; }

        public FullAuditShopEntity()
        {

        }
        public FullAuditShopEntity(TKey id):base(id)
        {

        }
    }

    public class BaseShopTenantEntity : BaseShopTenantEntity<long>
    {
        public BaseShopTenantEntity()
        {

        }
        public BaseShopTenantEntity(long id) : base(id)
        {

        }
    }
    public class BaseShopTenantEntity<TKey> : BaseTenantEntity<TKey>, IMultiShop
    {
        public int? ShopId { get; set; }
        public BaseShopTenantEntity()
        {

        }
        public BaseShopTenantEntity(TKey id) : base(id)
        {

        }
    }
    public class BaseTenantEntity<TKey> : FullAuditedEntity<TKey>, IMultiTenant
    {
        public Guid? TenantId { get; set; }
        public BaseTenantEntity()
        {

        }
        public BaseTenantEntity(TKey id) : base(id)
        {

        }
    }
}
