import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {ImportStockRouter} from "@pages/StockManagement/ImportStock/router";
import {TransferStockRouter} from "@pages/StockManagement/TransferStock/router";
import {CheckStockRouter} from "@pages/StockManagement/CheckStock/router";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {ExportCancelRouter} from "@pages/StockManagement/ExportCancel/router";
import {ExportStockRouter} from "@pages/StockManagement/ExportStock/router";
import {AppExtendCode} from "@ord-core/AppConst";

export const StockManagementRouter: OrdRouterItem[] = [
    ...ImportStockRouter,
    ...ExportCancelRouter,
    ...ExportStockRouter,
    ...TransferStockRouter,
    ...CheckStockRouter,
    {
        path: AppExtendCode.proShop +'/stock/inventory',
        lazyComponent: lazy(() => import('@pages/StockManagement/InventoryStock/index')),
        permission: PERMISSION_APP.stock.inventory,
    }
]
