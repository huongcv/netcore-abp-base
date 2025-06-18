import {AppExtendCode, DefaultAppPrefixUrl} from "@ord-core/AppConst";
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";

const prefix = AppExtendCode.golf;
export const GolfBookingRouter: OrdRouterItem[] = [
    {
        path: DefaultAppPrefixUrl + prefix + "/booking/full",
        lazyComponent: lazy(() => import("@pages/1.Golf/TeeSheet/Booking/IndexFull")),
        isEmptyLayout: true,
    },
    {
        path:  prefix + "/booking",
        lazyComponent: lazy(() => import("@pages/1.Golf/TeeSheet/Booking/Index")),
    }
];
