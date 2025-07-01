import {ShopOutlined, WindowsOutlined} from "@ant-design/icons";
import {SideNavInterface} from "@ord-core/model/side-nav.type";
import React from "react";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {SettingIcon} from "@ord-components/icon/menu/SettingIcon";

export default [
    // {
    //   path: "/dashboard-host",
    //   icon: <DashboardIcon />,
    //   title: "menu.dashboard",
    // },
    {
        icon: <ShopOutlined/>,
        path: "tenant",
        permission: PERMISSION_NAME_APP.admin.tenant,
        title: "menu.tenant",
    },
    {
        icon: <WindowsOutlined/>,
        title: "menu.masterData",
        children: [
            {
                path: "master-data/country",
                permission: PERMISSION_NAME_APP.masterData.country,
                title: "menu.country",
            },
            {
                path: "master-data/province",
                permission: PERMISSION_NAME_APP.masterData.province,
                title: "menu.countryState",
            },
            {
                path: "master-data/district",
                permission: PERMISSION_NAME_APP.masterData.district,
                title: "menu.district",
            },
            {
                path: "master-data/ward",
                permission: PERMISSION_NAME_APP.masterData.ward,
                title: "menu.ward",
            },
            {
                path: "master-data/package",
                permission: PERMISSION_NAME_APP.masterData.package,
                title: "menu.package",
            },
            {
                path: "master-data/dictionary",
                // permission: PERMISSION_APP.masterData.package,
                title: "menu.dictionary",
            },
        ],
    },
    {
        icon: <SettingIcon/>,
        title: "menu.admin",
        children: [
            {
                path: "users",
                permission: PERMISSION_NAME_APP.admin.user,
                title: "menu.user",
            },
            {
                path: "roles",
                permission: PERMISSION_NAME_APP.admin.role,
                title: "menu.role",
            },
            {
                path: "role-templates",
                title: "menu.templateRole",
                permission: PERMISSION_NAME_APP.admin.roleTemplate,
            },
            {
                path: "setting",
                permission: PERMISSION_NAME_APP.admin.setting,
                title: "menu.setting",
            },

            {
                path: "template-printer",
                title: "menu.templatePrinter",
                permission: PERMISSION_NAME_APP.admin.templatePrinterHost,
            },
        ],
    },
] as SideNavInterface[];
