import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { AppExtendCode } from "@ord-core/AppConst";

const prefix =  AppExtendCode.restaurant;

export const FnbAreaRouter: OrdRouterItem[] = [
  {
    path: prefix + "/area",
    lazyComponent: lazy(() => import("@pages/2.Restaurant/Area/FnbArea/Index")),
  },
  {
    path: prefix + "/table",
    lazyComponent: lazy(() => import("@pages/2.Restaurant/Area/FnbTable/Index")),
  },
  {
    path: prefix + "/processing-area",
    lazyComponent: lazy(() => import("@pages/2.Restaurant/Area/FnbProcessingArea/Index")),
  },
]
