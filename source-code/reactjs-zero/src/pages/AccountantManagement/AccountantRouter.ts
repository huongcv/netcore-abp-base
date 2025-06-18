import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";

export const AccountantRouter: OrdRouterItem[] = [
    {
        path: AppExtendCode.proShop +'/accountant/cashbook/dashboard',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/cashbook/index')),
        permission: PERMISSION_APP.accountant.cashbook
    },
    {
        path: AppExtendCode.proShop +'/accountant/cashbook/reason-type',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/reasonType/Index')),
        permission: PERMISSION_APP.accountant.moveReasonType
    },
    {
        path: AppExtendCode.proShop +'/accountant/bill',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/bill/index')),
        permission: PERMISSION_APP.accountant.bill
    },
    {
        path: AppExtendCode.proShop +'/accountant/pay',
        lazyComponent: lazy(() => import('@pages/AccountantManagement/pay/index')),
        permission: PERMISSION_APP.accountant.pay
    },
]
