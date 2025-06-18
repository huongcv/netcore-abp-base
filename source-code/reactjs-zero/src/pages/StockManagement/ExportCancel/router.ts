import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";

export const ExportCancelRouter: OrdRouterItem[] = [
    {
        path: AppExtendCode.proShop +'/stock/export-cancel',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportCancel/index')),
        permission: PERMISSION_APP.stock.exportCancel
    },
    {
        path: AppExtendCode.proShop +'/stock/export-cancel/add-new-cancel',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportCancel/UpsertForm')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
    {
        path: AppExtendCode.proShop +'/stock/export-cancel/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportCancel/UpsertForm')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
]
