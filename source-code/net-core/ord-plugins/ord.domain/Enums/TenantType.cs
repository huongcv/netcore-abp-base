using Ord.Plugin.Contract.Attributes;

namespace Ord.Domain.Enums
{
    public enum TenantType
    {
        [EnumDisplayText("TenantType.Other")]
        Other = 0,
        [EnumDisplayText("TenantType.Golf")]
        Golf = 100,
    }
}

