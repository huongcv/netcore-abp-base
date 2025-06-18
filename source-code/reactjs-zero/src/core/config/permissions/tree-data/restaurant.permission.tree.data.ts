import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const RESTAURANT_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.restaurant.order,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.restaurant.reservation,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
]