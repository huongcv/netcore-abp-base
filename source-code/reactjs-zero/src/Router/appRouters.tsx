import {lazy} from 'react';
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {AppExtendCode} from "@ord-core/AppConst";

const prefix = AppExtendCode.proShop;
export const appRouters: OrdRouterItem[] = [
    {
        path: '',
        index: true,
        lazyComponent: lazy(() => import('@pages/Home/StartApp')),
        // permission: PERMISSION_APP.dashboardTenant.viewDashboard
    },
    {
        path: prefix,
        lazyComponent: lazy(() => import('@pages/Home/StartApp')),
        // permission: PERMISSION_APP.dashboardTenant.viewDashboard
    },
    {
        path: 'notification',
        lazyComponent: lazy(() => import('@pages/Notification')),
        // permission: PERMISSION_APP.dashboardTenant.viewDashboard
    },
]
