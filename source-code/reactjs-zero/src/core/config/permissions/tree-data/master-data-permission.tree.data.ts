import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";


export const MASTER_DATA_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.masterData.province,
        actions: ['GetPaged', 'CreateOrUpdate', 'Remove']
    },
    {
        name: PERMISSION_APP.masterData.package,
        actions: ['GetPaged', 'CreateOrUpdate', 'Remove']
    }
];
