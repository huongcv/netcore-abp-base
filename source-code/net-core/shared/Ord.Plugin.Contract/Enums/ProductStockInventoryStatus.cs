using Ord.Plugin.Contract.Attributes;

namespace Ord.Plugin.Contract.Enums
{
    public enum ProductStockInventoryStatus
    {
        [EnumDisplayText("ProductStockInventoryStatus.InStock")]
        InStock = 0,

        [EnumDisplayText("ProductStockInventoryStatus.OutOfStock")]
        OutOfStock = 1
    }
}
