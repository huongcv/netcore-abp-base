export type PROP_SETTING_SHOP_SALE_INVOICE =
    | "useQrCodeTingeeBox"
    | "isOpenPopupDetail"
    | "isPrintInvoice"
    | "shopBankAccountId"
    | "useProductCache"

type TYPE_SETTING_SHOP_SALE_INVOICE = {
    [prop in PROP_SETTING_SHOP_SALE_INVOICE]: string
}
type IConstSettingUser = {
    saleInvoice: TYPE_SETTING_SHOP_SALE_INVOICE,
}

export const SETTING_NAME_FOR_USER: IConstSettingUser = {
    saleInvoice: {
        useQrCodeTingeeBox: "User:Setting:SaleInvoice:UseQrCodeTingeeBox",
        isOpenPopupDetail: "User:Setting:SaleInvoice:IsOpenPopupDetail",
        isPrintInvoice: "User:Setting:SaleInvoice:IsPrintInvoice",
        shopBankAccountId: "User:Setting:SaleInvoice:ShopBankAccountId",
        useProductCache: "User:Setting:SaleInvoice:UseProductCache",
    }
}
export type IFormSettingShop_SaleInvoice = {
    [prop in PROP_SETTING_SHOP_SALE_INVOICE]: any
}
