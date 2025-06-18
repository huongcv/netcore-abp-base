import { OrdPermissionTreeDataNode } from "@ord-core/config/permissions/tree-data/permission.tree.data";
import { PERMISSION_APP } from "@ord-core/config/permissions";

export const PRODUCT_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
  {
    name: PERMISSION_APP.product.product,
    actions: ["GetPaged", 'Create', 'Update', "Remove"],
  },
  {
    name: PERMISSION_APP.product.productGroup,
    actions: ["GetPaged", 'Create', 'Update', "Remove"],
  },
  {
    name: PERMISSION_APP.product.productPriceList,
    actions: ["GetPaged", 'Create', 'Update', "Remove"],
  },
  // {
  //   name: PERMISSION_APP.product.productDiscount,
  //   actions: ["GetPaged", "CreateOrUpdate", "Remove"],
  // },
  // {
  //   name: PERMISSION_APP.product.salesPromotion,
  //   actions: ["GetPaged", "CreateOrUpdate", "Remove"],
  // },
];
