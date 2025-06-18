import {AppExtendCode} from "@ord-core/AppConst";
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";

const prefix = AppExtendCode.golf;
export const GolfSystemRouter: OrdRouterItem[] = [
    {
        path: prefix + "/system/reason",
        lazyComponent: lazy(
            () => import("@pages/1.Golf/GolfSystem/GolfReason/index")
        ),
        // permission: PERMISSION_APP.product.productGroup,
    },
    {
        path: prefix + '/system/shop-setting',
        lazyComponent: lazy(() => import('@pages/System/ShopSetting/ShopSetting')),
    },
];
