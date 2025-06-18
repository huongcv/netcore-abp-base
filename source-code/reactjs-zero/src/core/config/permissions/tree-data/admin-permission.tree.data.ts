import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {GOLF_CATEGORY_PERMISSION_DATA,} from "@ord-core/config/permissions/tree-data/golf-permission.tree.data";

export const ADMIN_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.system.user,
        actions: ['Create', 'Update', 'Remove', 'ResetPassword', 'AssignRole', 'LoginPasswordless']
    },
    {
        name: PERMISSION_APP.system.role,
        actions: ['Create', 'Update', 'Remove', 'SetPermission']
    },
    // {
    //     name: PERMISSION_APP.system.tenant,
    //     actions: ['Create', 'Update', 'Remove', 'ViewUserList']
    // },
    {
        name: PERMISSION_APP.system.doctor,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.system.templatePrinterTenant,
        actions: ['GetPaged', 'Create', 'Update', 'Remove', 'setDefault', 'setActive']
    },
    {
        name: PERMISSION_APP.system.transferNationalPharmacy,
        actions: ['GetPaged']
    },
    {
        name: PERMISSION_APP.system.shopSetting,
        actions: ['GetPaged', 'Create', 'Update']
    },
    GOLF_CATEGORY_PERMISSION_DATA
    // {
    //     name: PERMISSION_APP.system.shopTemplate,
    //     actions: ['GetPaged', 'CreateOrUpdate']
    // },

];
