import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";

export const TransferStockRouter: OrdRouterItem[] = [
    {
        path: AppExtendCode.proShop +'/stock/transfer',
        lazyComponent: lazy(() => import('@pages/StockManagement/TransferStock')),
        permission: PERMISSION_APP.stock.transferStock
    },
    {
        path: AppExtendCode.proShop +'/stock/transfer/add-new',
        lazyComponent: lazy(() => import('@pages/StockManagement/TransferStock/AddNew')),
        permission: PERMISSION_APP.stock.transferStockCreateUpdate,
      //  isEmptyLayout: true
    },
    {
        path: AppExtendCode.proShop +'/stock/transfer/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/TransferStock/Edit')),
        permission: PERMISSION_APP.stock.transferStockCreateUpdate,
        //isEmptyLayout: true
    }
]
