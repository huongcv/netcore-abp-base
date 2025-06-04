using Ord.Plugin.Contract.Attributes;
using Ord.Plugin.Core.Enums;

namespace Ord.Plugin.Contract.Dtos
{
    public class UserInformationDto:UserBaseDto
    {
        public Guid Id { get; set; }
        public Guid? TenantId { get; set; }

        [IgnoreColumnName]
        public TenantType TenantType { get; set; }

        [IgnoreColumnName]
        public string TenantCode { get; set; }
        [IgnoreColumnName]
        public string TenantName { get; set; }
        [IgnoreColumnName]
        public object TenantDto { get; set; }
        [IgnoreColumnName]
        public bool IsSuperAdmin { get; set; }
        [IgnoreColumnName]
        public IEnumerable<string> ListPermission { get; set; }
        [IgnoreColumnName]
        public string? PackageRegistrationCode { get; set; }
    }

    public class UserCurrentShopAssign
    {
        public int ShopId { get; set; }
        public string ShopIdHash { get; set; }
        public  string? ShopName { get; set; }
        public  string? ShopCode { get; set; }
        public ShopType? ShopType { get; set; }

        //BUSINESS_TYPE_ENUM
        public int BusinessType { get; set; }
        
        public long? ProductPriceListMainId { get; set; }
        public bool IsMain { get; set; }
    }
    public class EmployeeCurrentUser
    {
        public long EmployeeId { get; set;}
        public string? EmployeeName { get; set; }
        public long DepartmentId { get; set; }
    }
}
