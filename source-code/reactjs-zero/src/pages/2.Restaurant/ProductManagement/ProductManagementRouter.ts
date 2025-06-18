import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { SalesPromotionRouter } from "./SalesPromotion/router";
import { AppExtendCode } from "@ord-core/AppConst";

const prefix = AppExtendCode.restaurant;

export const ProductManagementRouter: OrdRouterItem[] = [
  {
    path: prefix + "/product-group",
    lazyComponent: lazy(() => import("@pages/2.Restaurant/ProductManagement/ProductGroup")),
    permission: PERMISSION_APP.product.productGroup,
  },
  {
    path: prefix + "/product-group/import-excel",
    lazyComponent: lazy(
      () => import("@pages/2.Restaurant/ProductManagement/ProductGroup/import-excel")
    ),
    permission: PERMISSION_APP.product.productGroup,
  },
  {
    path: prefix + "/product",
    lazyComponent: lazy(() => import("@pages/2.Restaurant/ProductManagement/Product")),
    permission: PERMISSION_APP.product.product,
  },
  {
    path: prefix + "/product/import-excel",
    lazyComponent: lazy(
      () => import("@pages/2.Restaurant/ProductManagement/Product/import-excel")
    ),
    permission: PERMISSION_APP.product.product,
  },
  {
    path: prefix + "/product/detail/:id",
    lazyComponent: lazy(
      () => import("@pages/2.Restaurant/ProductManagement/Product/detail")
    ),
    permission: PERMISSION_APP.product.product,
  },
  {
    path: prefix + "/product/price-list",
    lazyComponent: lazy(() => import("@pages/2.Restaurant/ProductManagement/PriceList")),
    permission: PERMISSION_APP.product.productPriceList,
  },
  {
    path: prefix + "/product/price-list/:id",
    lazyComponent: lazy(
      () => import("@pages/2.Restaurant/ProductManagement/PriceList/detail")
    ),
    permission: PERMISSION_APP.product.productPriceList,
  },
  {
    path: prefix + "/product/discount",
    lazyComponent: lazy(() => import("@pages/2.Restaurant/ProductManagement/Discount")),
    permission: PERMISSION_APP.product.productDiscount,
  },
  ...SalesPromotionRouter,
];
