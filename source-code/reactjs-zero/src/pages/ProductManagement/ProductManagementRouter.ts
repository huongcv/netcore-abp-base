import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { SalesPromotionRouter } from "./SalesPromotion/router";
import {AppExtendCode} from "@ord-core/AppConst";

export const ProductManagementRouter: OrdRouterItem[] = [
  {
    path: AppExtendCode.proShop +"/product-group",
    lazyComponent: lazy(() => import("@pages/ProductManagement/ProductGroup")),
    permission: PERMISSION_APP.product.productGroup,
  },
  {
    path: AppExtendCode.proShop +"/product-group/import-excel",
    lazyComponent: lazy(
      () => import("@pages/ProductManagement/ProductGroup/import-excel")
    ),
    permission: PERMISSION_APP.product.productGroup,
  },
  {
    path: AppExtendCode.proShop +"/product",
    lazyComponent: lazy(() => import("@pages/ProductManagement/Product")),
    permission: PERMISSION_APP.product.product,
  },
  {
    path: AppExtendCode.proShop +"/product/import-excel",
    lazyComponent: lazy(
      () => import("@pages/ProductManagement/Product/import-excel")
    ),
    permission: PERMISSION_APP.product.product,
  },
  {
    path: AppExtendCode.proShop +"/product/detail/:id",
    lazyComponent: lazy(
      () => import("@pages/ProductManagement/Product/detail")
    ),
    permission: PERMISSION_APP.product.product,
  },
  {
    path: AppExtendCode.proShop +"/product/price-list",
    lazyComponent: lazy(() => import("@pages/ProductManagement/PriceList")),
    permission: PERMISSION_APP.product.productPriceList,
  },
  {
    path: AppExtendCode.proShop +"/product/price-list/:id",
    lazyComponent: lazy(
      () => import("@pages/ProductManagement/PriceList/detail")
    ),
    permission: PERMISSION_APP.product.productPriceList,
  },
  {
    path: AppExtendCode.proShop +"/product/discount",
    lazyComponent: lazy(() => import("@pages/ProductManagement/Discount")),
    permission: PERMISSION_APP.product.productDiscount,
  },
  ...SalesPromotionRouter,
];
