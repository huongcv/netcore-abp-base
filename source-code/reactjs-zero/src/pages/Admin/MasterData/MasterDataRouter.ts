import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";

export const MasterDataRouter: OrdRouterItem[] = [

    {
        path: "master-data/country",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Country")),
        permission: PERMISSION_NAME_APP.masterData.country,
    },
    {
        path: "master-data/country/import",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Country/import-excel")),
        permission: PERMISSION_NAME_APP.masterData.country,
    }
];
