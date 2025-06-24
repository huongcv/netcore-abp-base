import {HOST_ADMIN_PER} from "@ord-core/config/permissions/admin.permission";
import {DASHBOARD_TENANT} from "@ord-core/config/permissions/dashboard-tenant.permission";
import {MASTER_DATA_PER} from "@ord-core/config/permissions/master-data.permission";
import {PRODUCT_PER} from "@ord-core/config/permissions/product.permission";
import {REPORT_PER} from "@ord-core/config/permissions/report.permission";
import {SYSTEM_PER} from "./system.perrmission";

export const PERMISSION_APP = {
    admin: HOST_ADMIN_PER,
    system: SYSTEM_PER,
    masterData: MASTER_DATA_PER,
    product: PRODUCT_PER,
    dashboardTenant: DASHBOARD_TENANT,
    report:REPORT_PER,
}

export interface PERMISSION_TREE_TYPE {
    name?: string, // single node
    groupName?: string,  
    items?: any[]
}