import { ACCOUNTANT_PER } from "@ord-core/config/permissions/accountant.permission";
import { HOST_ADMIN_PER } from "@ord-core/config/permissions/admin.permission";
import { DASHBOARD_TENANT } from "@ord-core/config/permissions/dashboard-tenant.permission";
import { MASTER_DATA_PER } from "@ord-core/config/permissions/master-data.permission";
import { ORDER_STOCK_PER } from "@ord-core/config/permissions/orderStock.permission";
import { PARTNER_PER } from "@ord-core/config/permissions/partner.permission";
import { HUMAN_PER } from "@ord-core/config/permissions/payroll.permission";
import { PRODUCT_PER } from "@ord-core/config/permissions/product.permission";
import { REPORT_PER } from "@ord-core/config/permissions/report.permission";
import { SALE_INVOICE_PER } from "@ord-core/config/permissions/sale-invoice.permission";
import { STOCK_PER } from "@ord-core/config/permissions/stock.permission";
import { SYSTEM_PER } from "./system.perrmission";
import {RESTAURANT_PER} from "@ord-core/config/permissions/restaurant.permission";

export const PERMISSION_APP = {
    admin: HOST_ADMIN_PER,
    system: SYSTEM_PER,
    masterData: MASTER_DATA_PER,
    customer: PARTNER_PER,
    saleInvoice: SALE_INVOICE_PER,
    product: PRODUCT_PER,
    stock: STOCK_PER,
    orderStock: ORDER_STOCK_PER,
    accountant: ACCOUNTANT_PER,
    dashboardTenant: DASHBOARD_TENANT,
    report:REPORT_PER,
    human: HUMAN_PER,
    restaurant: RESTAURANT_PER,
}

export interface PERMISSION_TREE_TYPE {
    name?: string, // single node
    groupName?: string,  
    items?: any[]
}