import { PERMISSION_APP } from "@ord-core/config/permissions";
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import { MasterDataRouter } from "./MasterData/MasterDataRouter";

export const AdminRouter: OrdRouterItem[] = [
    {
        path: 'users',
        lazyComponent: lazy(() => import('@pages/Admin/Users')),
        permission: PERMISSION_APP.admin.user
    },
    {
        path: 'roles',
        lazyComponent: lazy(() => import('@pages/Admin/Roles')),
        permission: PERMISSION_APP.admin.role
    },
    {
        path: 'role-template',
        lazyComponent: lazy(() => import('@pages/Admin/TenantTemplateRole')),
        permission: PERMISSION_APP.admin.role
    },
    {
        path: 'tenant',
        lazyComponent: lazy(() => import('@pages/Admin/Tenants')),
        permission: PERMISSION_APP.admin.tenant
    },
    {
        path: 'shop',
        lazyComponent: lazy(() => import('../Admin/Shop')),
        permission: PERMISSION_APP.masterData.shop
    },
    {
        path: 'shop-detail/:id',
        lazyComponent: lazy(() => import('../Admin/Shop')),
        permission: PERMISSION_APP.masterData.shop
    },
    {
        path: 'tenant-detail/:id',
        lazyComponent: lazy(() => import('@pages/Admin/Tenants/Details')),
        permission: PERMISSION_APP.admin.tenant
    },
    {
        path: 'setting',
        lazyComponent: lazy(() => import('@pages/Admin/Setting')),
        permission: PERMISSION_APP.admin.setting
    },
    {
        path: 'template-printer',
        lazyComponent: lazy(() => import('@pages/Admin/TemplatePrinter/TemplatePrinterHost')),
        permission: PERMISSION_APP.admin.templatePrinterHost,
    },
    {
        path: 'template-printer/create/:enumId/:name',
        lazyComponent: lazy(() => import('@pages/Admin/TemplatePrinter/CruTemplatePrinterHost')),
    },
    {
        path: 'template-printer/update/:enumId/:id/:name',
        lazyComponent: lazy(() => import('@pages/Admin/TemplatePrinter/CruTemplatePrinterHost')),
    },


    ...MasterDataRouter
]
