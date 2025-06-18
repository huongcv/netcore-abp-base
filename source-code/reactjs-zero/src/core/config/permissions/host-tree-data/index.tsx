import {PERMISSION_APP, PERMISSION_TREE_TYPE} from "@ord-core/config/permissions";
import { CRUD_ACTIONS } from "../const";

export const HOST_PERMISSION_TREE : PERMISSION_TREE_TYPE[] = [
    {
        groupName: 'group-shop',
        items: [
            {
                name: PERMISSION_APP.admin.tenant,
                actions: ['GetPaged', 'Create', 'Update', 'Remove', 'ViewUserList']
            }
        ]
    },
    {
        groupName: 'group-master-data',
        items: [
            {
                name: PERMISSION_APP.masterData.country,
                actions: [...CRUD_ACTIONS]
            },
            {
                name: PERMISSION_APP.masterData.country_state,
                actions: [...CRUD_ACTIONS]
            },
            {
                name: PERMISSION_APP.masterData.district,
                actions: [...CRUD_ACTIONS]
            },
            {
                name: PERMISSION_APP.masterData.ward,
                actions: [...CRUD_ACTIONS]
            },
            {
                name: PERMISSION_APP.masterData.package,
                actions: [...CRUD_ACTIONS]
            },
        ]
    },
    {
        groupName: 'group-system',
        items: [
            {
                name: PERMISSION_APP.admin.role,
                actions: ['GetPaged', 'Create', 'Update', 'Remove', 'SetPermission']
            },
            {
                name: PERMISSION_APP.admin.user,
                actions: ['GetPaged', 'Create', 'Update', 'Remove', 'SetPermission']
            },
            {
                name: PERMISSION_APP.admin.templatePrinterHost,
                actions: [...CRUD_ACTIONS, 'setDefault', 'setActive']
            },
            {
                name: PERMISSION_APP.admin.setting,
                actions: ['GetPaged', 'SetValue']
            },
        ]
    },

]
