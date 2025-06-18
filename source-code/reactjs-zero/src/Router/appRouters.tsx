import {lazy} from 'react';
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {AdminRouter} from "@pages/Admin/AdminRouter";
import {PartnerRouter} from "@pages/Partner/PartnerRouter";
import {SalesInvoiceRouter} from "@pages/SalesInvoice/SalesInvoiceRouter";
import {ProductManagementRouter} from "@pages/ProductManagement/ProductManagementRouter";
import {StockManagementRouter} from "@pages/StockManagement/StockManagementRouter";
import {AccountantRouter} from "@pages/AccountantManagement/AccountantRouter";
import {WorkShiftRouter} from "@pages/WorkShift/WorkShiftRouter";
import {SystemRouter} from "@pages/System/SystemRouter";
import {ReportRouter} from "@pages/Report/ReportRouter";
import {HumanResourceRouter} from "@pages/HumanResource/HumanResourceRouter";
import {OrderRouter} from '@pages/Order/OrderRouter';
import {golfRoutes} from "@pages/1.Golf/golflRouter";
import {restaurantRoutes} from "./restaurantRouter";
import {AppExtendCode} from "@ord-core/AppConst";
import { SalesOrderRouter } from '@pages/SaleOrder/SalesOrderRouter';
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
        path: prefix + '/dashboard',
        lazyComponent: lazy(() => import('@pages/Dashboard')),
        // permission: PERMISSION_APP.dashboardTenant.viewDashboard
    },
    {
        path: 'notification',
        lazyComponent: lazy(() => import('@pages/Notification')),
        // permission: PERMISSION_APP.dashboardTenant.viewDashboard
    },

    ...PartnerRouter,
    ...SalesInvoiceRouter,
    ...SalesOrderRouter,
    ...OrderRouter,
    ...ProductManagementRouter,
    ...StockManagementRouter,
    ...AccountantRouter,
    ...WorkShiftRouter,
    ...SystemRouter,
    ...HumanResourceRouter,
    ...ReportRouter,

    ...golfRoutes,
    ...restaurantRoutes
]
