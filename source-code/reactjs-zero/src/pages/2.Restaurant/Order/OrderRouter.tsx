import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {AppExtendCode, DefaultAppPrefixUrl} from "@ord-core/AppConst";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const OrderRouter: OrdRouterItem[] = [
    {
        path: DefaultAppPrefixUrl + AppExtendCode.restaurant + '/order',
        lazyComponent: lazy(() => import('@pages/2.Restaurant/Order/index')),
        permission: PERMISSION_APP.restaurant.order,
        isEmptyLayout: true
    },
]
