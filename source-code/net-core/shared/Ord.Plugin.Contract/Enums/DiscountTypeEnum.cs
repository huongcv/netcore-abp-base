using Ord.Plugin.Contract.Attributes;

namespace Ord.Plugin.Contract.Enums
{
    public enum DiscountTypeEnum
    {
        // add name in comboEnum.json
        [EnumDisplayText("DiscountType.Value")]
        Value = 1,

        [EnumDisplayText("DiscountType.Percent")]
        Percent = 2
    }
}
