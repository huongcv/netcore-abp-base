import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const ACCOUNTANT_PERMISSION_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.accountant.cashbook,
         actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    // {
    //     name: PERMISSION_APP.accountant.receipt, // gộp phiếu thu và phiếu chi thành phiếu thu/chi
    //     actions: ['CreateOrUpdate', 'Remove']
    // },
    // {
    //     name: PERMISSION_APP.accountant.paymentVoucher,
    //     actions: ['CreateOrUpdate', 'Remove']
    // },
    {
        name: PERMISSION_APP.accountant.moveReasonType,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    // {
    //     name: PERMISSION_APP.accountant.pay,
    //     actions: ['GetPaged', 'CreateOrUpdate', 'Remove']
    // },
    // {
    //     name: PERMISSION_APP.accountant.bill,
    //     actions: ['GetPaged', 'CreateOrUpdate', 'Remove']
    // },
];
