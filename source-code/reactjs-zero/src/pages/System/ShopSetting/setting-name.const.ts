export type PROP_SETTING_SHOP_Connect =
    "tingee" | "nationalPharmacy" | "nationalPrescription"
    ;
export type PROP_SETTING_SHOP_General = "expiredWarning" // Ngày hết hạn
    | "closingDate" | 'useCenterBilling' // ngày chốt sổ
    | "isSingleCustomerGroup" // Hệ thống chỉ có một nhóm khách hàng duy nhất (true/false)
    |"isCustomerCodePrefixByGroup" // Mã khách hàng có tiền tố theo nhóm (true/false)
    | "isSingleEmployeeGroup" // Hệ thống chỉ có một nhóm nhân viên duy nhất (true/false)
    | "isEmployeeCodePrefixByGroup" // Mã nhân viên có tiền tố theo nhóm (true/false)
    ;
export type PROP_SETTING_SHOP_ConfigDefaulGolf =
    "golfProductGreenFreeDefault"
    | "golfProductRentalBuggyHalfDefault"
    | "golfProductRentalBuggyAllDefault"
    | "golfProductRentalCaddyDefault"
    | "golfProductCaddyBookingFeeDefault"
    ;
type TYPE_SETTING_SHOP_General = {
    [prop in PROP_SETTING_SHOP_General]: string
}
type TYPE_SETTING_SHOP_ConfigDefaulGolf = {
    [prop in PROP_SETTING_SHOP_ConfigDefaulGolf]: string
}

export type PROP_SETTING_SHOP_Invoice = "usingInvoice" // Sử dụng hóa đơn điện tử
    | 'isInvoiceDraft'
    | "supplier" // nhà cung cấp
    | 'company'
    | 'userName'
    | 'password'
    | 'adminUserName'
    | 'adminPassword'
    | 'apiURL'
    | 'accessURL'
    | 'issueDraft'
    | 'template'
    | 'type'
    | 'number'
    | 'taxCode'
    | 'department'
    | 'phoneNumber'
    | 'appId'
    | 'issueHSM'
    | 'address'
    | 'adminUser'
    | 'adminPwd'
    | 'urlAPI'
    | 'method'
    | 'time'
    | 'monthlyRate'
    | 'autoDelete';
type TYPE_SETTING_SHOP_Invoice = {
    [prop in PROP_SETTING_SHOP_Invoice]: string
}
type TYPE_SETTING_SHOP_Connect = {
    [prop in PROP_SETTING_SHOP_Connect]: string
}


type IConstSettingShop = {
    general: TYPE_SETTING_SHOP_General,
    configDefaulGolf: TYPE_SETTING_SHOP_ConfigDefaulGolf,
    invoice: TYPE_SETTING_SHOP_Invoice,
    connect: TYPE_SETTING_SHOP_Connect
}

export const SETTING_NAME_FOR_SHOP: IConstSettingShop = {
    general: {
        expiredWarning: 'Shop:Setting:General:ExpiredWarning',
        closingDate: 'Shop:Setting:General:ClosingDate',
        useCenterBilling: "Shop:Setting:General:UseCenterBilling",
        isSingleCustomerGroup: "Shop:Setting:General:Partner:IsSingleCustomerGroup", // Hệ thống chỉ có một nhóm khách hàng duy nhất (true/false)
        isCustomerCodePrefixByGroup: "Shop:Setting:General:Partner:IsCustomerCodePrefixByGroup", // Mã khách hàng có tiền tố theo nhóm
        isSingleEmployeeGroup: "Shop:Setting:General:Partner:IsSingleEmployeeGroup", // Hệ thống chỉ có một nhóm nhân viên duy nhất (true/false)
        isEmployeeCodePrefixByGroup: "Shop:Setting:General:Partner:IsEmployeeCodePrefixByGroup", // Mã nhân viên có tiền tố theo nhóm
    },
    configDefaulGolf: {
        golfProductGreenFreeDefault: "Shop:Setting:Golf:Config:GreenFreeDefault", // cấu hình phí sân golf
        golfProductRentalBuggyHalfDefault: "Shop:Setting:Golf:Config:RentalBuggyHalf", // cấu hình thue xe golf 1/2
        golfProductRentalBuggyAllDefault: "Shop:Setting:Golf:Config:RentalBuggyAll", // cấu hình thue xe golf
        golfProductRentalCaddyDefault: "Shop:Setting:Golf:Config:RentalCaddy", // cấu hình thue caddy
        golfProductCaddyBookingFeeDefault: "Shop:Setting:Golf:Config:CaddyBookingFee", // cấu hình phí booking caddy
    },
    invoice: {
        usingInvoice: 'Shop:Setting:EInvoice:UsingInvoice',
        supplier: 'Shop:Setting:EInvoice:Supplier',
        company: 'Shop:Setting:EInvoice:Company',
        userName: 'Shop:Setting:EInvoice:UserName',
        password: 'Shop:Setting:EInvoice:Password',
        adminUserName: 'Shop:Setting:EInvoice:Admin_UserName',
        adminPassword: 'Shop:Setting:EInvoice:Admin_Password',
        apiURL: 'Shop:Setting:EInvoice:API_URL',
        accessURL: 'Shop:Setting:EInvoice:ACCESS_URL',
        issueDraft: 'Shop:Setting:EInvoice:ISSUE_DRAFT',
        template: 'Shop:Setting:EInvoice:Template',
        type: 'Shop:Setting:EInvoice:Type',
        number: 'Shop:Setting:EInvoice:Number',
        taxCode: 'Shop:Setting:EInvoice:TaxCode',
        department: 'Shop:Setting:EInvoice:Department',
        phoneNumber: 'Shop:Setting:EInvoice:PhoneNumber',
        appId: 'Shop:Setting:EInvoice:AppId',
        issueHSM: 'Shop:Setting:EInvoice:IssueHSM',
        address: 'Shop:Setting:EInvoice:Address',
        isInvoiceDraft: 'Shop:Setting:EInvoice:IsInvoiceDraft',
        adminPwd: 'Shop:Setting:EInvoice:AdminPassword',
        adminUser: 'Shop:Setting:EInvoice:AdminUserName',
        urlAPI: 'Shop:Setting:EInvoice:UrlAPI',
        method: "Shop:Setting:EInvoice:Method", 
        time: "Shop:Setting:Einvoice:Time", 
        monthlyRate: "Shop:Setting:EInvoice:MonthlyRate",
        autoDelete: "Shop:Setting:EInvoice:AutoDelete",

    },
    connect: {
        nationalPharmacy: "Shop:Setting:Connect:NationalPharmacy", /// Dược quốc gia
        nationalPrescription: "Shop:Setting:Connect:NationalPrescription", // Đơn thuốc quốc gia
        tingee: "Shop:Setting:Connect:Tingee",
    }


}
export type IFormSettingShop_General = {
    [prop in PROP_SETTING_SHOP_General]: any
}
export type IFormSettingShop_Invoice = {
    [prop in PROP_SETTING_SHOP_Invoice]: any
}
export type IFormSettingShop_Connect = {
    [prop in PROP_SETTING_SHOP_Connect]: any
}
export type IFormSettingShop_ConfigDefaulGolf = {
    [prop in PROP_SETTING_SHOP_ConfigDefaulGolf]: any
}
