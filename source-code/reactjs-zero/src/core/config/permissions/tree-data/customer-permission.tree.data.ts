import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const CUSTOMER_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.customer.customer,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.customer.customerGroup,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
];
