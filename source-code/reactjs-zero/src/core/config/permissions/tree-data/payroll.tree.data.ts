import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {PERMISSION_APP} from "@ord-core/config/permissions";

export const HUMAN_TREE_DATA: OrdPermissionTreeDataNode[] = [
    {
        name: PERMISSION_APP.human.employee,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.human.workCalendar,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.human.allowance,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.human.employeeTimekeeping,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.human.timesheet,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
    {
        name: PERMISSION_APP.human.employeePayroll,
        actions: ['GetPaged', 'Create', 'Update', 'Remove']
    },
   

   
];
