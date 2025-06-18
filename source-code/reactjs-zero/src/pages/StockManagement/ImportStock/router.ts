import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";

export const ImportStockRouter: OrdRouterItem[] = [
  {
    path: AppExtendCode.proShop +"/stock/import",
    lazyComponent: lazy(() => import("@pages/StockManagement/ImportStock")),
    permission: PERMISSION_APP.stock.importStock,
  },
  {
    path: AppExtendCode.proShop +"/stock/import/add-new-supplier",
    lazyComponent: lazy(
      () => import("@pages/StockManagement/ImportStock/UpsertForm")
    ),
    permission: PERMISSION_APP.stock.importStockCreateUpdate,
    //isEmptyLayout: true
  },
  {
    path: AppExtendCode.proShop +"/stock/import/update/:id",
    lazyComponent: lazy(
      () => import("@pages/StockManagement/ImportStock/UpsertForm")
    ),
    permission: PERMISSION_APP.stock.importStockCreateUpdate,
    // isEmptyLayout: true
  },
  {
    path: AppExtendCode.proShop +"/stock/import/clone/:id",
    lazyComponent: lazy(
        () => import("@pages/StockManagement/ImportStock/UpsertForm")
    ),
    permission: PERMISSION_APP.stock.importStockCreateUpdate,
    // isEmptyLayout: true
  },
];
