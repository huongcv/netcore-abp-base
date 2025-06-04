using Ord.Plugin.Core.Enums;

namespace Ord.Plugin.Contract.Dtos
{
    public class AppBootstrapDto
    {
        public Dictionary<string, object> Setting { get; set; }
        public UserInformationDto? User { get; set; }
        public bool IsLogined => User != null;
        public IEnumerable<UserCurrentShopAssign> ListAssignedShop { get; set; }
        public int? CurrentShop { get; set; }
        public string? CurrentShopHashId { get; set; }

        public ShopType? CurrentShopType { get; set; }

        //BUSINESS_TYPE_ENUM
        public int BusinessType { get; set; }

        public bool? IsShopMain { get; set; }
        public long? ProductPriceListMainId { get; set; }

        public string? EInvoiceMethod { get; set; }

        public OrdThemeDto? Theme { get; set; }
    }

    public class OrdThemeDto
    {
        public string? ThemeInfo { get; set; }
        public string? LogoFull { get; set; }
        public string? LogoSimple { get; set; }
        public string? Copyright { get; set; }
        public string? SystemName { get; set; }
        public string? DescriptionPage { get; set; }
        public string? FaviconIco { get; set; }
        public string? BgLoginLeft { get; set; }
        public string? BgLoginUnder { get; set; }
        public string? LandingPageUrl { get; set; }
        public List<string>? DashboardSlider { get; set; }
        public string? DashboardSlider1 { get; set; }
        public string? DashboardSlider2 { get; set; }
        public string? DashboardSlider3 { get; set; }
        public string? DashboardSlider4 { get; set; }
        public string? DashboardSlider5 { get; set; }
        
    }
}
