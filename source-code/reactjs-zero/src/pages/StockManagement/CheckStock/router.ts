import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";

export const CheckStockRouter: OrdRouterItem[] = [
    {
        path: AppExtendCode.proShop +'/stock/check',
        lazyComponent: lazy(() => import('@pages/StockManagement/CheckStock')),
        permission: PERMISSION_APP.stock.checkStock
    }, {
        path: AppExtendCode.proShop +'/stock/check/add-new',
        lazyComponent: lazy(() => import('@pages/StockManagement/CheckStock/AddNew')),
        permission: PERMISSION_APP.stock.checkStockCreateUpdate,
       // isEmptyLayout: true
    },
    {
        path: AppExtendCode.proShop +'/stock/check/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/CheckStock/Edit')),
        permission: PERMISSION_APP.stock.checkStockCreateUpdate,
       // isEmptyLayout: true
    }
]
