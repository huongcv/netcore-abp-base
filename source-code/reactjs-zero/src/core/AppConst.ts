export const PriceFixNumber = 0;
export const HotKeyScope = {
    crudPageBase: "crudPageBaseHotKeyScope",
    moveStockContainer: "moveStockContainerHotKeyScope"
}
export const CodeCountryVietNam = "C01";
export const DefaultAppPrefixUrl = "/app/"; // Bắt buộc có dấu / cuối cùng nha ko sẽ không hiện selected menu và Breadcrumb
export const DefaultHostPrefixUrl = "/admin/"; // Bắt buộc có dấu / cuối cùng nha ko sẽ không hiện selected menu và Breadcrumb
export const ROLE_PHARMACY = "ROLE_PHARMACY";
export const currencyDefault = "";
export const TaxCodeNotUse = "-";

export type SystemCodeType = "shop" | "golf" | "hotel" | "restaurant"
export const AppExtendCode: {
    [key in  "golf" | "hotel" | "restaurant" | "proShop"]: SystemCodeType
} = {
    golf: "golf",
    hotel: "hotel",
    restaurant: "restaurant",
    proShop: "shop",

}
export enum UserConst {
    AdminTenantLevel = "admin_tenant",
    SaLevel = "sa",
    SaUserLevel = "sa_user",
    UserLevel = "user",
    PrefixShopRole = "_TENANT"
}

export const PACKAGE_TEST_CODE = ['GC30', 'GTN30'];
