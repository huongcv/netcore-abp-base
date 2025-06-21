import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const MasterDataRouter: OrdRouterItem[] = [

    {
        path: "master-data/country",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Country")),
        permission: PERMISSION_APP.masterData.country,
    }
];
