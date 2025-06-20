import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {GOLF_PER} from "@ord-core/config/permissions/golf.permission";


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
