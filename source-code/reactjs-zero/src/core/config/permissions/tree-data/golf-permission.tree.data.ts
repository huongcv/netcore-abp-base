import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {GOLF_PER} from "@ord-core/config/permissions/golf.permission";
import {HOST_ADMIN_PER} from "@ord-core/config/permissions/admin.permission";
import {SYSTEM_PER} from "@ord-core/config/permissions/system.perrmission";
import {MASTER_DATA_PER} from "@ord-core/config/permissions/master-data.permission";
import {PARTNER_PER} from "@ord-core/config/permissions/partner.permission";
import {SALE_INVOICE_PER} from "@ord-core/config/permissions/sale-invoice.permission";
import {PRODUCT_PER} from "@ord-core/config/permissions/product.permission";
import {STOCK_PER} from "@ord-core/config/permissions/stock.permission";
import {ORDER_STOCK_PER} from "@ord-core/config/permissions/orderStock.permission";
import {ACCOUNTANT_PER} from "@ord-core/config/permissions/accountant.permission";
import {DASHBOARD_TENANT} from "@ord-core/config/permissions/dashboard-tenant.permission";
import {REPORT_PER} from "@ord-core/config/permissions/report.permission";
import {HUMAN_PER} from "@ord-core/config/permissions/payroll.permission";


export const GOLF_CATEGORY_PERMISSION_DATA: OrdPermissionTreeDataNode = {
    name: GOLF_PER.category.category,
    children:[
        {
            name: GOLF_PER.category.course,
        },
        {
            name: GOLF_PER.category.buggy,
        },
        {
            name: GOLF_PER.category.locker,
        },
        {
            name: GOLF_PER.category.teeTime,
        },
        {
            name: GOLF_PER.category.accessCard,
        },
        {
            name: GOLF_PER.category.reason,
        },
    ]
}
