import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const MasterDataRouter: OrdRouterItem[] = [
    {
        path: "master-data/province",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Province")),
        permission: PERMISSION_APP.masterData.province,
    },
    {
        path: "master-data/country",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Country")),
        permission: PERMISSION_APP.masterData.country,
    },
    {
        path: "master-data/country/import",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Country/import-excel")),
        permission: PERMISSION_APP.masterData.country,
    },
    {
        path: "master-data/country-state",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/CountryState")),
        permission: PERMISSION_APP.masterData.country_state,
    },
    {
        path: "master-data/district",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/District")),
        permission: PERMISSION_APP.masterData.district,
    },
    {
        path: "master-data/ward",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Ward")),
        permission: PERMISSION_APP.masterData.ward,
    },
    {
        path: "master-data/package",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Package")),
        permission: PERMISSION_APP.masterData.package,
    },
    {
        path: "master-data/dictionary",
        lazyComponent: lazy(() => import("@pages/Admin/MasterData/Dictionary")),
        permission: PERMISSION_APP.masterData.dictionary,
    },
];
