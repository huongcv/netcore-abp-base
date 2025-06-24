import {ADMIN_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/admin-permission.tree.data";
import {PRODUCT_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/product-permission.tree.data";
import {REPORT_TREE_DATA} from "@ord-core/config/permissions/tree-data/report.tree.data";
import {PERMISSION_TREE_TYPE} from "..";

export const PERMISSION_TREE: PERMISSION_TREE_TYPE[] = [
    {
        name: 'DashboardTenant',
    },
    {
        name: 'SaleInvoice.Sell',
    },
    {
        name: 'SaleInvoice.Invoice',
    },
    {
        name: 'Order.Customer',
    },
    {
        name: 'Golf.Booking',
    },
    {
        groupName: 'group-product',
        items: PRODUCT_PERMISSION_TREE_DATA
    },
    {
        groupName: 'group-report',
        items: REPORT_TREE_DATA
    },
    {
        groupName: 'group-admin',
        items: ADMIN_PERMISSION_TREE_DATA
    },
]
