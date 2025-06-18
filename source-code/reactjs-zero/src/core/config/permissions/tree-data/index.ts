import {ACCOUNTANT_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/accountant-permission.tree.data";
import {ADMIN_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/admin-permission.tree.data";
import {CUSTOMER_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/customer-permission.tree.data";
import {HUMAN_TREE_DATA} from "@ord-core/config/permissions/tree-data/payroll.tree.data";
import {PRODUCT_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/product-permission.tree.data";
import {REPORT_TREE_DATA} from "@ord-core/config/permissions/tree-data/report.tree.data";
import {STOCK_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/stock.tree.data";
import {PERMISSION_TREE_TYPE} from "..";
import {RESTAURANT_PERMISSION_TREE_DATA} from "@ord-core/config/permissions/tree-data/restaurant.permission.tree.data";

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
        groupName: 'restaurant',
        items: RESTAURANT_PERMISSION_TREE_DATA
    },
    {
        groupName: 'group-customer',
        items: CUSTOMER_PERMISSION_TREE_DATA
    },
    {
        groupName: 'group-stock',
        items: STOCK_PERMISSION_TREE_DATA
    },
    {
        groupName: 'group-cashbook',
        items: ACCOUNTANT_PERMISSION_TREE_DATA
    },

    {
        groupName: 'group-product',
        items: PRODUCT_PERMISSION_TREE_DATA
    },
    {
        groupName: 'group-human',
        items: HUMAN_TREE_DATA
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
