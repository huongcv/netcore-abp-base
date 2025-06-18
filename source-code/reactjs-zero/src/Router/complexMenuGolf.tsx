import {SolutionOutlined, UserSwitchOutlined,} from "@ant-design/icons";
import {SideNavInterface} from "@ord-core/model/side-nav.type";
import React from "react";
import {AppExtendCode} from "@ord-core/AppConst";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {InvoiceIcon} from "@ord-components/icon/menu/InvoiceIcon";
import {AccountantIcon} from "@ord-components/icon/menu/AccountantIcon";
import {SettingIcon} from "@ord-components/icon/menu/SettingIcon";
import {ProductIcon} from "@ord-components/icon/menu/ProductIcon";
import {GOLF_PER} from "@ord-core/config/permissions/golf.permission";
import {DashboardIcon} from "@ord-components/icon/menu/DashboardIcon";
import {PayrollIcon} from "@ord-components/icon/menu/PayrollIcon";
import ReservationIcon from "@ord-components/icon/ReservationIcon";

const prefix = AppExtendCode.golf;
export default [
    {
        icon: <DashboardIcon/>,
        path: prefix + "/dashboard",
        permission: GOLF_PER.booking,
        title: "Dashboard",
    },
    {
        icon: <ReservationIcon width={22} height={22}/>,
        path: prefix + "/booking/full",
        permission: GOLF_PER.booking,
        title: "menu." + prefix + ".booking",
    },
    {
        icon: <SolutionOutlined  style={{fontSize: "20px"}}/>,
        path: prefix + "/valet",
        permission: GOLF_PER.booking,
        title: "menu." + prefix + ".valet",
    },
    {
        icon: <UserSwitchOutlined style={{fontSize: "20px"}}/>,
        permission: PERMISSION_APP.customer.customer,
        title: "menu.customer",
        path: prefix + "/customer",
        // children: [
        //   {
        //     path: prefix + "/customer",
        //     permission: PERMISSION_APP.customer.customer,
        //     // icon: <UsergroupDeleteOutlined />,
        //     title: "menu.customer",
        //   },
        //   {
        //     path: prefix + "/golfer-group",
        //     permission: PERMISSION_APP.customer.customerGroup,
        //     // icon: <UsergroupDeleteOutlined />,
        //     title: "menu.golferGroup",
        //   },
        //
        // ],
    },
    {
        icon: <InvoiceIcon/>,
        title: "menu.saleInvoice",
        path: prefix + "/sales-invoice/invoice",
        permission: PERMISSION_APP.saleInvoice.invoice,
    },
    {
        path: prefix + "/accountant/cashbook/dashboard",
        icon: <AccountantIcon/>,
        title: "menu.cashbook",
        permission: PERMISSION_APP.accountant.cashbook,
    },
    {
        icon: <ProductIcon/>,
        title: "menu.service",
        path: prefix + "/services",
        permission: PERMISSION_APP.product.product,
    },
    // {
    //   icon: <AppstoreOutlined />,
    //   title: "menu.category.title",
    //   children: [
    //
    //   ],
    // },

    {
        icon: <PayrollIcon/>,
        title: "menu.human",
        permission: PERMISSION_APP.human.employee,
        children: [
            {
                path: prefix + "/human-resource/employee",
                title: "menu.employee",
                permission: PERMISSION_APP.human.employee,
            },
            {
                path: prefix + "/human-resource/work-calendar",
                title: "menu.workCalendar",
                permission: PERMISSION_APP.human.workCalendar,
            },
            {
                path: prefix + "/human-resource/allowance",
                title: "menu.allowance",
                permission: PERMISSION_APP.human.allowance,
            },
            {
                path: prefix + "/human-resource/timekeeping",
                title: "menu.timekeeping",
                permission: PERMISSION_APP.human.employeeTimekeeping,
            },
            {
                path: prefix + "/human-resource/timesheet",
                title: "menu.timesheet",
                permission: PERMISSION_APP.human.timesheet,
            },
            {
                path: prefix + "/human-resource/payroll",
                title: "menu.payroll",
                permission: PERMISSION_APP.human.employeeTimekeeping,
            },
        ],
    },
    {
        icon: <SettingIcon/>,
        title: "menu.admin",
        children: [
            {
                path: prefix + "/system/user",
                title: "menu.userEmployee",
                permission: PERMISSION_APP.system.user,
            },
            {
                path: prefix + "/system/roles",
                permission: PERMISSION_APP.system.role,
                title: "menu.role",
            },
            {
                path: prefix + "/system/template-printer",
                title: "menu.templatePrinterTenant",
                permission: PERMISSION_APP.admin.templatePrinterTenant,
            },
            {
                path: prefix + "/category/course",
                title: "menu.course",
                permission: GOLF_PER.category.course,
            },
            {
                path: prefix + "/category/golf-cart",
                permission: GOLF_PER.category.buggy,
                title: "menu.category.cart",
            },
            {
                path: prefix + "/category/locker",
                permission: GOLF_PER.category.locker,
                title: "menu.category.locker",
            },
            {
                path: prefix + "/category/tee-time-config",
                permission: GOLF_PER.category.teeTime,
                title: "menu.teeTime",
            },
            {
                path: prefix + "/category/golf-access-card",
                permission: GOLF_PER.category.accessCard,
                // icon: <UsergroupDeleteOutlined />,
                title: "menu.golfAccessCard",
            },
            {
                path: prefix + "/category/golf-access-card-color",
                permission: GOLF_PER.category.accessCard,
                // icon: <UsergroupDeleteOutlined />,
                title: "menu.golfAccessCardColor",
            },
            {
                path: prefix + "/system/reason",
                permission: GOLF_PER.category.reason,
                title: "menu.systems.reason",
            },
            {
                path: prefix + "/system/shop-setting",
                title: "menu.shopSetting",
                permission: PERMISSION_APP.system.shopSetting,
            },

        ],
    }
] as SideNavInterface[];
