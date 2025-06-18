import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { AppExtendCode } from "@ord-core/AppConst";
export const SalesOrderRouter: OrdRouterItem[] = [
  {
    path: AppExtendCode.proShop + "/sale/order",
    lazyComponent: lazy(() => import("@pages/SaleOrder/Order")),
    // permission: PERMISSION_APP.saleInvoice.invoice
  },
  {
    path: AppExtendCode.proShop + "/sale/order/add-new",
    lazyComponent: lazy(() => import("@pages/SaleOrder/Order/AddNew")),
    // permission: PERMISSION_APP.saleInvoice.invoice
  },
  {
    path: AppExtendCode.proShop + "/sale/order/update/:id",
    lazyComponent: lazy(() => import("@pages/SaleOrder/Order/Edit")),
    // permission: PERMISSION_APP.saleInvoice.invoice
  },
];
