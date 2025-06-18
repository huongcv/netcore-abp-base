import { PERMISSION_APP } from "@ord-core/config/permissions";
import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import {AppExtendCode} from "@ord-core/AppConst";

export const OrderRouter: OrdRouterItem[] = [
    {
        path: AppExtendCode.proShop +'/order/customer',
        lazyComponent: lazy(() => import('@pages/Order/OrderCustomer/index')),
        permission: PERMISSION_APP.saleInvoice.sell,
    },
    {
        path: AppExtendCode.proShop +'/order/customer/add-new',
        lazyComponent: lazy(() => import('@pages/Order/OrderCustomer/form/CreateOrUpdateOrderForm')),
        permission: PERMISSION_APP.saleInvoice.sell,
    },
    {
        path: AppExtendCode.proShop +'/order/supplier',
        lazyComponent: lazy(() => import('@pages/Order/OrderSupplier/index')),
        permission: PERMISSION_APP.saleInvoice.sell,
    },
]
