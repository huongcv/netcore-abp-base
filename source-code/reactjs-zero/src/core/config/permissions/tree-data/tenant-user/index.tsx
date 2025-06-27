import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {CRUD_ACTIONS} from "../const";
import {PERMISSION_TREE_TYPE} from "@ord-core/config/permissions/types";

export const TENANT_PERMISSION_TREE: PERMISSION_TREE_TYPE[] = [
    {
        groupName: 'group-shop',
        items: [
            {
                name: PERMISSION_NAME_APP.admin.tenant,
                actions: ['GetPaged', 'Create', 'Update', 'Remove', 'ViewUserList']
            }
        ]
    },
    {
        groupName: 'group-master-data',
        items: [
            {
                name: PERMISSION_NAME_APP.masterData.country,
                actions: [...CRUD_ACTIONS]
            }
        ]
    }
]
