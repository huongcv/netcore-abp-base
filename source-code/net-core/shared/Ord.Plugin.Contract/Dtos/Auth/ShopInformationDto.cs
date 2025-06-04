using Ord.Plugin.Contract.Attributes;
using Ord.Plugin.Core.Enums;

namespace Ord.Plugin.Contract.Dtos
{
    public class ShopInformationDto 
    {
        public int ShopId { get; set; }
        public string? ShopName { get; set; }
        public string? ShopCode { get; set; }
        public bool IsMain { get; set; }

        public long? InventoryMainId { get; set; }
        public long? CashBookMainId { get; set; }
        public long? ProductPriceListMainId { get; set; }
        public ShopType? Type { get; set; }
    }

    
}
