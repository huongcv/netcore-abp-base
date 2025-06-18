import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const OrderStockRouter: OrdRouterItem[] = [
    {
        path: '/stock/order',
        lazyComponent: lazy(() => import('@pages/StockManagement/OrderStock')),
    },
    {
        path: '/stock/order/add-new',
        lazyComponent: lazy(() => import('@pages/StockManagement/OrderStock/AddNew')),
        //  isEmptyLayout: true
    },
    {
        path: '/stock/order/update/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/OrderStock/Edit')),
        //isEmptyLayout: true
    },

    {
        path: '/stock/gdp-order',
        lazyComponent: lazy(() => import('../GdpOrderStock')),
        permission: PERMISSION_APP.orderStock.gdpOrder
    },
    {
        path: '/stock/gdp-order/confirm/:id',
        lazyComponent: lazy(() => import('@pages/StockManagement/GdpOrderStock/Edit')),
        permission: PERMISSION_APP.orderStock.gdpOrder
        //isEmptyLayout: true
    },

]
