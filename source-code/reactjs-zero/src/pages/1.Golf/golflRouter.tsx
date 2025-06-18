import { lazy } from "react";
import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import {AppExtendCode, DefaultAppPrefixUrl} from "@ord-core/AppConst";
import { GolfCategoryRouter } from "@pages/1.Golf/Category/GolfCategoryRouter";
import { GolfBookingRouter } from "@pages/1.Golf/TeeSheet/Booking/GolfBookingRouter";
import { GolfSystemRouter } from "./GolfSystem/GolfSystemRouter";
import { GolfHrRouter } from "./GolfHr/GolfHrRoute";
import { PERMISSION_APP } from "@ord-core/config/permissions";

export const prefix = AppExtendCode.golf;
export const golfRoutes: OrdRouterItem[] = [
  {
    path: prefix,
    lazyComponent: lazy(() => import("@pages/Home/StartApp")),
  },
  {
    path: prefix + "/dashboard",
    lazyComponent: lazy(() => import("@pages/1.Golf/Dashboard")),
  },
  ...GolfBookingRouter,
  {
    path: prefix + "/customer",
    lazyComponent: lazy(() => import("@pages/1.Golf/GolfCustomer/Customer")),
  },
  {
    path: prefix + "/customer/:id",
    lazyComponent: lazy(() => import("@pages/1.Golf/GolfCustomer/Customer/Form/CustomerDetail")),
  },
  {
    path: prefix + "/customer/import-excel",
    lazyComponent: lazy(() => import("@pages/1.Golf/GolfCustomer/Customer/ImportExcel")),
  },
  {
    path: prefix + "/golfer-group",
    lazyComponent: lazy(() => import("@pages/1.Golf/GolfCustomer/GolferGroup")),
  },
  {
    path: prefix + "/golfer-group/import-excel",
    lazyComponent: lazy(
      () => import("@pages/1.Golf/GolfCustomer/GolferGroup/import-excel")
    ),
  },
  {
    path: prefix + "/golfer-group/customer-group-detail/:id",
    lazyComponent: lazy(
      () =>
        import(
          "@pages/1.Golf/GolfCustomer/GolferGroup/MemberShip/CustomerGroupDetail"
        )
    ),
  },
  {
    path: DefaultAppPrefixUrl + prefix + "/valet",
    lazyComponent: lazy(() => import("@pages/1.Golf/TeeSheet/Valet/IndexFull")),
    isEmptyLayout: true,
  },
  {
    path: prefix + "/services",
    lazyComponent: lazy(() => import("@pages/1.Golf/GolfServices")),
  },
  ...GolfCategoryRouter,
  ...GolfHrRouter,
  ...GolfSystemRouter,
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
  // #endregin Hoa Don
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
];
