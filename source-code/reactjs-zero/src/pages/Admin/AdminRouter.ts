import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {MasterDataRouter} from "./MasterData/MasterDataRouter";

export const AdminRouter: OrdRouterItem[] = [
    {
        path: 'users',
        lazyComponent: lazy(() => import('@pages/Admin/Users')),
        permission: PERMISSION_NAME_APP.admin.user
    },
    {
        path: 'roles',
        lazyComponent: lazy(() => import('@pages/Admin/Roles')),
        permission: PERMISSION_NAME_APP.admin.role
    },
    {
        path: 'role-templates',
        lazyComponent: lazy(() => import('@pages/Admin/RoleTemplates')),
        permission: PERMISSION_NAME_APP.admin.role
    },
    {
        path: 'tenant',
        lazyComponent: lazy(() => import('@pages/Admin/Tenants')),
        permission: PERMISSION_NAME_APP.admin.tenant
    },
    {
        path: 'tenant/detail/:id',
        lazyComponent: lazy(() => import('@pages/Admin/Tenants/Details')),
        permission: PERMISSION_NAME_APP.admin.tenant
    },
    {
        path: 'setting',
        lazyComponent: lazy(() => import('@pages/Admin/Setting')),
        permission: PERMISSION_NAME_APP.admin.setting
    },
    ...MasterDataRouter
]
