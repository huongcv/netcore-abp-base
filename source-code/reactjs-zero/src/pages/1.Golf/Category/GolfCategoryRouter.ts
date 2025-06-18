import { AppExtendCode } from "@ord-core/AppConst";
import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";

const prefix = AppExtendCode.golf;
export const GolfCategoryRouter: OrdRouterItem[] = [
  {
    path: prefix + "/category/course",
    lazyComponent: lazy(() => import("@pages/1.Golf/Category/Course")),
    // permission: PERMISSION_APP.product.productGroup,
  },
  {
    path: prefix + "/category/golf-cart",
    lazyComponent: lazy(() => import("@pages/1.Golf/GolfCart/index")),
  },
  {
    path: prefix + "/category/tee-time-config",
    lazyComponent: lazy(() => import("@pages/1.Golf/Category/TeeTime/index")),
  },
  {
    path: prefix + "/category/locker",
    lazyComponent: lazy(() => import("@pages/1.Golf/Category/Locker")),
  },
   {
    path: prefix + "/category/golf-access-card",
    lazyComponent: lazy(
      () => import("@pages/1.Golf/Category/MemberShipCard")
    ),
  },
  {
    path: prefix + "/category/golf-access-card-color",
    lazyComponent: lazy(
      () => import("@pages/1.Golf/Category/AccessCardColor")
    ),
  },
  {
    path: prefix + "/category/golf-access-card/import-excel",
    lazyComponent: lazy(
      () => import("@pages/1.Golf/Category/MemberShipCard/ImportExcel/index")
    ),
  },
];
