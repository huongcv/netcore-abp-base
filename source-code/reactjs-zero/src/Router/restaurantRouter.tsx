import { lazy } from 'react';
import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { AppExtendCode } from "@ord-core/AppConst";
import { ProductManagementRouter } from '@pages/2.Restaurant/ProductManagement/ProductManagementRouter';
import { FnbAreaRouter } from '@pages/2.Restaurant/Area/FnbAreaRouter';
import { PERMISSION_APP } from '@ord-core/config/permissions';
import {OrderRouter} from "@pages/2.Restaurant/Order/OrderRouter";

const prefix = AppExtendCode.restaurant;
export const restaurantRoutes: OrdRouterItem[] = [
    // #region Dashboard & Reservation
    {
        path: prefix,
        lazyComponent: lazy(() => import("@pages/Home/StartApp")),
    },
    {
        path: prefix + '/dashboard',
        lazyComponent: lazy(() => import('@pages/2.Restaurant/Dashboard/index')),
    },
    {
        path: prefix + '/reservation',
        lazyComponent: lazy(() => import('@pages/2.Restaurant/Reservation/index')),
    },
    // {
    //     path: prefix + '/table-list',
    //     lazyComponent: lazy(() => import('@pages/2.Restaurant/Reservation/TableList/index')),
    // },
    // #endregion

    // #region Đối tác
    {
        path: prefix + "/partner/customer",
        lazyComponent: lazy(() => import("@pages/Customer/Index")),
        permission: PERMISSION_APP.customer.viewCustomerList,
    },
    {
        path: prefix + "/partner/customer/details/:partnerHashId",
        lazyComponent: lazy(() => import("@pages/Customer/CusDetails")),
        permission: PERMISSION_APP.customer.viewCustomerList,
    },
    {
        path: prefix + "/partner/customer/import-excel",
        lazyComponent: lazy(() => import("@pages/Customer/ImportExcel")),
        permission: PERMISSION_APP.customer.viewCustomerList,
    },
    {
        path: prefix + "/partner/customer-supplier",
        lazyComponent: lazy(() => import("@pages/Partner/CustomerSupplier/Index")),
        permission: PERMISSION_APP.stock.supplier,
    },
    {
        path: prefix + "/partner/customer-supplier/import-excel",
        lazyComponent: lazy(() => import("@pages/Partner/CustomerSupplier/ImportExcel/index")),
        permission: PERMISSION_APP.stock.supplier,
    },
    {
        path: prefix + "/partner/customer-supplier/details/:partnerHashId",
        lazyComponent: lazy(() => import("@pages/Partner/CustomerSupplier/CusSupplierDetails")),
        permission: PERMISSION_APP.stock.supplier,
    },
    {
        path: prefix + "/partner/doctor",
        lazyComponent: lazy(() => import("@pages/Partner/Doctor/Index")),
        permission: PERMISSION_APP.system.doctor,
    },
    {
        path: prefix + "/partner/doctor/import-excel",
        lazyComponent: lazy(() => import("@pages/Partner/Doctor/ImportExcel/index")),
        permission: PERMISSION_APP.system.doctor,
    },
    {
        path: prefix + "/partner/doctor/details/:partnerHashId",
        lazyComponent: lazy(() => import("@pages/Partner/Doctor/ViewDoctorDetails")),
        permission: PERMISSION_APP.system.doctor,
    },
    {
        path: prefix + "/customer-group/import-excel",
        lazyComponent: lazy(() => import("@pages/Partner/CustomerGroup/ImportData")),
    },
    {
        path: prefix + "/supplier-group/import-excel",
        lazyComponent: lazy(() => import("@pages/Partner/CustomerSupplierGroup/ImportData")),
    },
    {
        path: prefix + "/doctor-group/import-excel",
        lazyComponent: lazy(() => import("@pages/Partner/DoctorGroup/ImportData")),
    },
    // #endregion

    // #region Hệ thống
    {
        path: prefix + "/system/stock-inventory",
        lazyComponent: lazy(() => import("@pages/System/StockInventory/Index")),
        permission: PERMISSION_APP.system.stockInventory,
    },
    {
        path: prefix + "/system/user",
        lazyComponent: lazy(() => import("@pages/System/Users/index")),
        permission: PERMISSION_APP.system.user,
    },
    {
        path: prefix + "/system/sample-sales-order",
        lazyComponent: lazy(() => import("@pages/System/SampleSalesOrder/SampleSalesOrderList")),
        permission: PERMISSION_APP.system.shopTemplate,
    },
    {
        path: prefix + "/system/sample-receipt",
        lazyComponent: lazy(() => import("@pages/System/SampleReceipt/SampleReceiptList")),
        permission: PERMISSION_APP.system.shopTemplate,
    },
    {
        path: prefix + "/system/shop-template/create/:type",
        lazyComponent: lazy(() => import("@pages/System/ShopTemplate/Upsert/CruShopTemplate")),
        permission: PERMISSION_APP.system.shopTemplate + ".Create",
    },
    {
        path: prefix + "/system/shop-template/update/:hashId/:type",
        lazyComponent: lazy(() => import("@pages/System/ShopTemplate/Upsert/CruShopTemplate")),
        permission: PERMISSION_APP.system.shopTemplate + ".Create",
    },
    {
        path: prefix + "/system/bank-account",
        lazyComponent: lazy(() => import("@pages/System/BankAccount/index")),
    },
    {
        path: prefix + '/system/shop-setting',
        lazyComponent: lazy(() => import('@pages/System/ShopSetting/ShopSetting')),
        permission: PERMISSION_APP.system.shopSetting,
    },
    {
        path: prefix + '/system/roles',
        lazyComponent: lazy(() => import('@pages/System/Roles')),
        permission: PERMISSION_APP.system.role
    },
    {
        path: prefix + '/system/template-printer',
        lazyComponent: lazy(() => import('@pages/System/TemplatePrinter/TemplatePrinterTenantV2')),
        permission: PERMISSION_APP.admin.templatePrinterTenant,
    },
    {
        path: prefix + '/system/template-printer/create',
        lazyComponent: lazy(() => import('@pages/System/TemplatePrinter/CruTemplatePrinterTenantV2')),
    },
    {
        path: prefix + '/system/template-printer/update/:id',
        lazyComponent: lazy(() => import('@pages/System/TemplatePrinter/CruTemplatePrinterTenantV2')),
    },
    // #endregion

    // #region Hoá đơn
    {
        path: prefix + '/sales-invoice/sell',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/Sell')),
        permission: PERMISSION_APP.saleInvoice.sell,
        isEmptyLayout: true
    },
    {
        path: prefix + '/sales-invoice/invoice',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/Invoice')),
        permission: PERMISSION_APP.saleInvoice.invoice
    },
    {
        path: prefix + '/sales-invoice/invoice-return',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/InvoiceReturn')),
        permission: PERMISSION_APP.saleInvoice.invoiceReturn
    },
    {
        path: prefix + '/sales-invoice/log-api',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/Invoice/LogApi/Index')),
    },
    // #endregion

    // #region Kho
    {
        path: prefix + "/stock/import",
        lazyComponent: lazy(() => import("@pages/StockManagement/ImportStock")),
        permission: PERMISSION_APP.stock.importStock,
    },
    {
        path: prefix + "/stock/import/add-new-supplier",
        lazyComponent: lazy(() => import("@pages/StockManagement/ImportStock/AddNew")),
        permission: PERMISSION_APP.stock.importStockCreateUpdate,
    },
    {
        path: prefix + '/stock/import/add-new-other',
        lazyComponent: lazy(() => import('@pages/StockManagement/ImportStock/AddNew')),
        permission: PERMISSION_APP.stock.importStockCreateUpdate,
    },
    {
        path: prefix + "/stock/import/update/:id",
        lazyComponent: lazy(() => import("@pages/StockManagement/ImportStock/Edit")),
        permission: PERMISSION_APP.stock.importStockCreateUpdate,
    },
    {
        path: prefix + '/stock/export-cancel',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportCancel/index')),
        permission: PERMISSION_APP.stock.exportCancel
    },
    {
        path: prefix + '/stock/export-cancel/add-new-cancel',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportCancel/UpsertForm')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
    {
        path: prefix + '/stock/export-cancel/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportCancel/UpsertForm')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
    {
        path: prefix + '/stock/export-supplier',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock')),
        permission: PERMISSION_APP.stock.exportSupplier
    },
    {
        path: prefix + '/stock/export-supplier/add-new-supplier',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock/AddNew')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
    {
        path: prefix + '/stock/export-supplier/add-new-supplier-from-move/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock/AddNew')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
    {
        path: prefix + '/stock/export-supplier/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock/Edit')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
    {
        path: prefix + '/stock/transfer',
        lazyComponent: lazy(() => import('@pages/StockManagement/TransferStock')),
        permission: PERMISSION_APP.stock.transferStock
    },
    {
        path: prefix + '/stock/transfer/add-new',
        lazyComponent: lazy(() => import('@pages/StockManagement/TransferStock/AddNew')),
        permission: PERMISSION_APP.stock.transferStockCreateUpdate,
    },
    {
        path: prefix + '/stock/transfer/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/TransferStock/Edit')),
        permission: PERMISSION_APP.stock.transferStockCreateUpdate,
    },
    {
        path: prefix + '/stock/check',
        lazyComponent: lazy(() => import('@pages/StockManagement/CheckStock')),
        permission: PERMISSION_APP.stock.checkStock
    },
    {
        path: prefix + '/stock/check/add-new',
        lazyComponent: lazy(() => import('@pages/StockManagement/CheckStock/AddNew')),
        permission: PERMISSION_APP.stock.checkStockCreateUpdate,
    },
    {
        path: prefix + '/stock/check/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/CheckStock/Edit')),
        permission: PERMISSION_APP.stock.checkStockCreateUpdate,
    },
    // #endregion

    // #region Thu/chi
    {
        path: prefix + '/accountant/cashbook/dashboard',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/cashbook/index')),
        permission: PERMISSION_APP.accountant.cashbook
    },
    {
        path: prefix + '/accountant/cashbook/reason-type',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/reasonType/Index')),
        permission: PERMISSION_APP.accountant.moveReasonType
    },
    {
        path: prefix + '/accountant/bill',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/bill/index')),
        permission: PERMISSION_APP.accountant.bill
    },
    {
        path: prefix + '/accountant/pay',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/pay/index')),
        permission: PERMISSION_APP.accountant.pay
    },
    // #endregion

    // #region Nhân sự
    {
        path: prefix + '/human-resource/payroll',
        lazyComponent: lazy(() => import('@pages/HumanResource/Payroll/index')),
        permission: PERMISSION_APP.human.employeePayroll
    },
    {
        path: prefix + '/human-resource/allowance',
        lazyComponent: lazy(() => import('@pages/HumanResource/Allowance/index')),
        permission: PERMISSION_APP.human.allowance
    },
    {
        path: prefix + '/human-resource/employee',
        lazyComponent: lazy(() => import('@pages/HumanResource/Employee/Index')),
        permission: PERMISSION_APP.human.employee
    },
    {
        path: prefix + '/human-resource/timekeeping',
        lazyComponent: lazy(() => import('@pages/HumanResource/EmployeeTimekeeping/index')),
        permission: PERMISSION_APP.human.employeeTimekeeping
    },
    {
        path: prefix + '/human-resource/payroll/detail/:id',
        lazyComponent: lazy(() => import('@pages/HumanResource/Payroll/edit')),
    },
    {
        path: prefix + '/human-resource/timesheet',
        lazyComponent: lazy(() => import('@pages/HumanResource/Timesheet/index')),
        permission: PERMISSION_APP.human.timesheet
    },
    {
        path: prefix + '/human-resource/work-calendar',
        lazyComponent: lazy(() => import('@pages/HumanResource/ShopWorkCalendar/shopWorkCalendarList')),
        permission: PERMISSION_APP.human.workCalendar
    },
    // #endregion

    // #region Báo cáo
    {
        path: prefix + "/report",
        lazyComponent: lazy(() => import("@pages/Report/ListRepost")),
    },
    // Báo cáo Pharmacy Log
    {
        path: prefix + "/report/pharmacy-log/medication-sales",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportMedicationSales")),
    },
    {
        path: prefix + "/report/pharmacy-log/drug-recall-tracking",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/DrugRecall/ReportPharmacyLogDrugRecall")),
    },
    {
        path: prefix + "/report/pharmacy-log/drug-stock-in-out",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportPharmacyLogDrugStockInOut")),
    },
    {
        path: prefix + "/report/pharmacy-log/expiration-date-tracking",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportPharmacyLogExpirationDateTracking")),
    },
    {
        path: prefix + "/report/pharmacy-log/patient-information",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportPharmacyLogPatientInformation")),
    },
    {
        path: prefix + "/report/pharmacy-log/prescription-drug-sales",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportPharmacyLogPrescriptionDrugSales")),
    },
    {
        path: prefix + "/report/pharmacy-log/non-prescription-drug-sales",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportPharmacyLogNonPrescriptionDrugSales")),
    },
    {
        path: prefix + "/report/pharmacy-log/quality-inspection",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/QualityInspection/ReportPharmacyLogQualityInspection")),
    },
    {
        path: prefix + "/report/pharmacy-log/quality-inspection/create",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport")),
    },
    {
        path: prefix + "/report/pharmacy-log/quality-inspection/update/:hashId",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/QualityInspection/CruQualityInspectionReport")),
    },
    {
        path: prefix + "/report/pharmacy-log/adverse-drug-reaction",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/AdverseReaction/ReportPharmacyAdverseReaction")),
    },
    {
        path: prefix + "/report/pharmacy-log/adverse-drug-reaction/create-update",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/AdverseReaction/Form/CreateOrUpdateFormAdverseReaction")),
    },
    {
        path: prefix + "/report/pharmacy-log/adverse-drug-reaction/create-update/:id",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/AdverseReaction/Form/CreateOrUpdateFormAdverseReaction")),
    },
    {
        path: prefix + "/report/pharmacy-log/complaint-handling",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ComplaintLog/ReportPharmacyComplaintLog")),
    },
    {
        path: prefix + "/report/pharmacy-log/temperature-humidity",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/TempHumidityTracking/TempHumidityTracking")),
    },
    {
        path: prefix + "/report/pharmacy-log/sanitation-monitoring",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/CleaningTaskTracking/index")),
    },
    {
        path: prefix + "/report/pharmacy-log/controlled-drugs-stock",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportPharmacyLogControlledDrugStock")),
    },
    {
        path: prefix + "/report/pharmacy-log/controlled-drugs-loss",
        lazyComponent: lazy(() => import("@pages/Report/PharmacyLog/ReportPharmacyLogControlledDrugLoss")),
    },
    // Báo cáo Daily Summary
    {
        path: prefix + "/report/daily-summary/sell",
        lazyComponent: lazy(() => import("@pages/Report/DailySummary/ReportDailySummarySell")),
    },
    {
        path: prefix + "/report/daily-summary/product",
        lazyComponent: lazy(() => import("@pages/Report/DailySummary/ReportDailySummaryProduct")),
    },
    {
        path: prefix + "/report/daily-summary/income",
        lazyComponent: lazy(() => import("@pages/Report/DailySummary/ReportDailySummaryIncome")),
    },
    {
        path: prefix + "/report/daily-summary/hand-over",
        lazyComponent: lazy(() => import("@pages/Report/DailySummary/ReportDailyHandOver")),
    },
    {
        path: prefix + "/report/daily-summary/shift-revenue",
        lazyComponent: lazy(() => import("@pages/Report/DailySummary/ReportDailySummaryShiftRevenue")),
    },
    // Báo cáo Sale
    {
        path: prefix + "/report/sale/revenue",
        lazyComponent: lazy(() => import("@pages/Report/Sell/ReportSellRevenue")),
    },
    {
        path: prefix + "/report/sale/product",
        lazyComponent: lazy(() => import("@pages/Report/Sell/ReportSellProduct")),
    },
    {
        path: prefix + "/report/sale/income",
        lazyComponent: lazy(() => import("@pages/Report/Sell/ReportIncome")),
    },
    {
        path: prefix + "/report/sale/profit",
        lazyComponent: lazy(() => import("@pages/Report/Sell/ReportSellProfit/ReportSellProfit")),
    },
    {
        path: prefix + "/report/sale/revenue-details",
        lazyComponent: lazy(() => import("@pages/Report/Sell/ReportSellRevenueDetails")),
    },
    // Báo cáo Customer
    {
        path: prefix + "/report/customer/revenue",
        lazyComponent: lazy(() => import("@pages/Report/Customer/ReportCustomerRevenue")),
    },
    {
        path: prefix + "/report/customer/revenue-details",
        lazyComponent: lazy(() => import("@pages/Report/Customer/ReportCustomerRevenueDetail")),
    },
    {
        path: prefix + "/report/customer/debt",
        lazyComponent: lazy(() => import("@pages/Report/Customer/ReportCustomerDebt")),
    },
    // Báo cáo Stock
    {
        path: prefix + "/report/stock/import-export-inventory",
        lazyComponent: lazy(() => import("@pages/Report/Stock/ReportStockImportExportInventory")),
    },
    {
        path: prefix + "/report/stock/disposal-report",
        lazyComponent: lazy(() => import("@pages/Report/Stock/ReportStockDisposalReport")),
    },
    {
        path: prefix + "/report/stock/commodity-expiry",
        lazyComponent: lazy(() => import("@pages/Report/Stock/ReportStockCommodityExpiry")),
    },
    {
        path: prefix + "/report/stock/commodity-plan",
        lazyComponent: lazy(() => import("@pages/Report/Stock/ReportStockCommodityPlan")),
    },
    // Báo cáo Employee
    {
        path: prefix + "/report/employee/revenue",
        lazyComponent: lazy(() => import("@pages/Report/Employee/ReportEmployeeRevenue")),
    },
    {
        path: prefix + "/report/employee/revenue-details",
        lazyComponent: lazy(() => import("@pages/Report/Employee/ReportEmployeeRevenueDetail")),
    },
    {
        path: prefix + "/report/employee/revenue-product",
        lazyComponent: lazy(() => import("@pages/Report/Employee/ReportEmployeeProduct")),
    },
    // Báo cáo Doctor
    {
        path: prefix + "/report/doctor/revenue",
        lazyComponent: lazy(() => import("@pages/Report/Doctor/Revenue/ReportDoctorRevenue")),
    },
    {
        path: prefix + "/report/doctor/profit",
        lazyComponent: lazy(() => import("@pages/Report/Doctor/Profit/ReportDoctorProfit")),
    },
    {
        path: prefix + "/report/doctor/product",
        lazyComponent: lazy(() => import("@pages/Report/Doctor/ReportDoctorProduct")),
    },
    // Báo cáo Supplier
    {
        path: prefix + "/report/supplier/supplier-product",
        lazyComponent: lazy(() => import("@pages/Report/Supplier/ReportSupplierProduct")),
    },
    {
        path: prefix + "/report/supplier/supplier-import",
        lazyComponent: lazy(() => import("@pages/Report/Supplier/ReportSupplierImport")),
    },
    {
        path: prefix + "/report/supplier/supplier-debt",
        lazyComponent: lazy(() => import("@pages/Report/Supplier/ReportSupplierDebt")),
    },
    // Báo cáo Financial
    {
        path: prefix + "/report/financial/financial-details",
        lazyComponent: lazy(() => import("@pages/Report/Financial/ReportFinancialDetails")),
    },
    // #endregion
    ...ProductManagementRouter,
    ...FnbAreaRouter,
    ...OrderRouter
];
