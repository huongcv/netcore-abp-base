import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";

export const ExportStockRouter: OrdRouterItem[] = [
    //Xuat tra nha cc
    {
        path: AppExtendCode.proShop +'/stock/export-supplier',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock')),
        permission: PERMISSION_APP.stock.exportSupplier
    },
    {
        path: AppExtendCode.proShop +'/stock/export-supplier/add-new-supplier',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock/AddNew')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },{
        path: AppExtendCode.proShop +'/stock/export-supplier/add-new-supplier-from-move/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock/AddNew')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    },
    {
        path: AppExtendCode.proShop +'/stock/export-supplier/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/ExportStock/Edit')),
        permission: PERMISSION_APP.stock.exportStockCreateUpdate,
    }
]
