using Ord.Plugin.Contract.Consts;
using Ord.Plugin.Core.Enums;
using Volo.Abp.Application.Dtos;

namespace Ord.Plugin.Contract.Dtos
{
    public class UserInformationDto:UserBaseDto
    {
        public Guid Id { get; set; }
        public Guid? TenantId { get; set; }
        public TenantType TenantType { get; set; }
        public string? TenantCode => TenantDto?.Code;
        public string? TenantName => TenantDto?.Name;
        public TenantSharedDto? TenantDto { get; set; }
        public bool IsSuperAdmin => string.Equals(Level, UserConst.SaLevel, StringComparison.OrdinalIgnoreCase);
        public IEnumerable<string> ListPermission { get; set; }
    }

    public class TenantSharedDto: EntityDto<Guid>
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActived { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
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
