import { PERMISSION_APP } from "@ord-core/config/permissions";
import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import {AppExtendCode} from "@ord-core/AppConst";

export const SystemRouter: OrdRouterItem[] = [
  {
    path: AppExtendCode.proShop +"/system/stock-inventory",
    lazyComponent: lazy(() => import("@pages/System/StockInventory/Index")),
    permission: PERMISSION_APP.system.stockInventory,
  },
  {
    path: AppExtendCode.proShop +"/system/user",
    lazyComponent: lazy(() => import("@pages/System/Users/index")),
    permission: PERMISSION_APP.system.user,
  },
  {
    path: AppExtendCode.proShop +"/system/sample-sales-order",
    lazyComponent: lazy(
      () => import("@pages/System/SampleSalesOrder/SampleSalesOrderList")
    ),
    permission: PERMISSION_APP.system.shopTemplate,
  },
  {
    path: AppExtendCode.proShop +"/system/sample-receipt",
    lazyComponent: lazy(
      () => import("@pages/System/SampleReceipt/SampleReceiptList")
    ),
    permission: PERMISSION_APP.system.shopTemplate,
  },
  {
    path: AppExtendCode.proShop +"/system/shop-template/create/:type",
    lazyComponent: lazy(
      () => import("@pages/System/ShopTemplate/Upsert/CruShopTemplate")
    ),
    permission: PERMISSION_APP.system.shopTemplate + ".Create",
  },
  {
    path: AppExtendCode.proShop +"/system/shop-template/update/:hashId/:type",
    lazyComponent: lazy(
      () => import("@pages/System/ShopTemplate/Upsert/CruShopTemplate")
    ),
    permission: PERMISSION_APP.system.shopTemplate + ".Create",
  },
  {
    path: AppExtendCode.proShop +"/system/bank-account",
    lazyComponent: lazy(() => import("@pages/System/BankAccount/index")),
    // permission: PERMISSION_APP.masterData.bank_account,
  },
  {
    path: AppExtendCode.proShop +"/system/transfer-national-pharmacy",
    lazyComponent: lazy(() => import('@pages/System/TransferNationalPharmacy')),
    permission: PERMISSION_APP.system.transferNationalPharmacy,
  },
  {
    path: AppExtendCode.proShop +'/system/shop-setting',
    lazyComponent: lazy(() => import('@pages/System/ShopSetting/ShopSetting')),
    permission: PERMISSION_APP.system.shopSetting,
  },
  {
    path: AppExtendCode.proShop +'/system/roles',
    lazyComponent: lazy(() => import('@pages/System/Roles')),
    permission: PERMISSION_APP.system.role
  },
  {
    path:  AppExtendCode.proShop +'/template-printer',
    lazyComponent: lazy(() => import('@pages/System/TemplatePrinter/TemplatePrinterTenantV2')),
    permission: PERMISSION_APP.admin.templatePrinterTenant,
  },

  {
    path:  AppExtendCode.proShop +'/template-printer/create',
    lazyComponent: lazy(() => import('@pages/System/TemplatePrinter/CruTemplatePrinterTenantV2')),
  },
  {
    path:  AppExtendCode.proShop +'/template-printer/update/:id',
    lazyComponent: lazy(() => import('@pages/System/TemplatePrinter/CruTemplatePrinterTenantV2')),
  },
];
