import { PERMISSION_APP } from "@ord-core/config/permissions";
import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import {AppExtendCode} from "@ord-core/AppConst";

export const SalesPromotionRouter: OrdRouterItem[] = [
  {
    path: AppExtendCode.proShop +"/product/sales-promotion",
    lazyComponent: lazy(
      () => import("@pages/ProductManagement/SalesPromotion")
    ),
    permission: PERMISSION_APP.product.salesPromotion,
  },
  {
    path: AppExtendCode.proShop +"/product/sales-promotion/create-update",
    lazyComponent: lazy(
      () => import("@pages/ProductManagement/SalesPromotion/CreateOrUpdate")
    ),
    permission: PERMISSION_APP.product.salesPromotion,
  },
  {
    path: AppExtendCode.proShop +"/product/sales-promotion/create-update/:id",
    lazyComponent: lazy(
      () => import("@pages/ProductManagement/SalesPromotion/CreateOrUpdate")
    ),
    permission: PERMISSION_APP.product.salesPromotion,
  },
];
