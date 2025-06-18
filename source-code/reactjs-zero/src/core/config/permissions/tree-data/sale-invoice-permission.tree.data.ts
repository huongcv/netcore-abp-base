import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const SALE_INVOICE_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.saleInvoice.invoice,
        actions: ['GetPaged', 'Remove', "CreateOrUpdate"]
    },
    {
        name: PERMISSION_APP.saleInvoice.invoiceReturn,
        actions: ['GetPaged', 'Remove', "CreateOrUpdate"]
    }
];
