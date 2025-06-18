import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const STOCK_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.orderStock.gdpOrder,
    },
    {
        name: PERMISSION_APP.stock.importStock,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.stock.exportSupplier,
        actions: ['GetPaged', 'Create', 'Update',  'Remove']
    },
    {
        name: PERMISSION_APP.stock.exportCancel,
        actions: ['GetPaged', 'Create', 'Update',  'Remove']
    },
    {
        name: PERMISSION_APP.stock.transferStock,
        actions: ['GetPaged', 'Create', 'Update',  'Remove']
    },
    {
        name: PERMISSION_APP.stock.checkStock,
        actions: ['GetPaged', 'Create', 'Update',  'Remove']
    },
    {
        name: PERMISSION_APP.stock.supplierManager,
        children: [
            {
                name: PERMISSION_APP.stock.supplier,
                actions: ['GetPaged', 'Create', 'Update', 'Remove']
            },
            {
                name: PERMISSION_APP.stock.supplierGroup,
                actions: ['GetPaged', 'Create', 'Update', 'Remove']
            },
        ]
    },
];
