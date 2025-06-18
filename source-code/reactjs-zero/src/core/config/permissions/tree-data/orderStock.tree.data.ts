import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const ORDER_STOCK_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.orderStock.order,
    },
    {
        name: PERMISSION_APP.orderStock.gdpOrder,
    }
];
