import {UserSwitchOutlined} from "@ant-design/icons";
import {AccountantIcon} from "@ord-components/icon/menu/AccountantIcon";
import {DashboardIcon} from "@ord-components/icon/menu/DashboardIcon";
import {InvoiceIcon} from "@ord-components/icon/menu/InvoiceIcon";
import {PayrollIcon} from "@ord-components/icon/menu/PayrollIcon";
import {ProductIcon} from "@ord-components/icon/menu/ProductIcon";
import {ReportIcon} from "@ord-components/icon/menu/ReportIcon";
import {SettingIcon} from "@ord-components/icon/menu/SettingIcon";
import {StockIcon} from "@ord-components/icon/menu/StockIcon";
import {AppExtendCode, ROLE_PHARMACY} from "@ord-core/AppConst";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {SideNavInterface} from "@ord-core/model/side-nav.type";

import OrderIcon2 from "@ord-components/icon/OrderIcon2";
import React from "react";
import ReservationIcon from "@ord-components/icon/ReservationIcon";

const prefix = AppExtendCode.restaurant;
export default [
    {
        icon: <DashboardIcon/>,
        path: prefix + "/dashboard",
        // permission: PERMISSION_APP.admin.tenant,
        title: "Dashboard",
    },
    {
        icon: <ReservationIcon width={22} height={22}/>,
        permission: PERMISSION_APP.restaurant.reservation,
        title: "Đặt bàn",
        path: prefix + "/reservation",
        // children: [
        //     {
        //         path: prefix + "/book",
        //         // permission: PERMISSION_APP.masterData.country,
        //         // icon: <UsergroupDeleteOutlined />,
        //         title: "Đặt trước ",
        //     },
        //     {
        //         path: prefix + "/table-list",
        //         // permission: PERMISSION_APP.masterData.country,
        //         // icon: <UsergroupDeleteOutlined />,
        //         title: "Danh sách bàn",
        //     },
        // ],
    },
    {
        icon: <OrderIcon2 style={{fontSize: '22px'}}/>,
        permission: PERMISSION_APP.restaurant.order,
        title: "Gọi món",
        path: prefix + "/order",
    },
    // Hoá đơn
    // {
    //     icon: <SaleIcon style={{ width: 20 }} />,
    //     title: "menu.sell",
    //     path: prefix + "/sales-invoice/sell",
    //     permission: PERMISSION_APP.saleInvoice.sell,
    // },
    {
        icon: <InvoiceIcon/>,
        title: "menu.saleInvoice",
        path: prefix + "/sales-invoice/invoice",
        permission: PERMISSION_APP.saleInvoice.invoice,
    },
    {
        icon: <UserSwitchOutlined style={{fontSize: "20px"}}/>,
        title: "menu.customer",
        path: prefix + "/partner/customer",
        permission: PERMISSION_APP.customer.viewCustomerList,
    },
    {
        icon: <ProductIcon/>,
        title: "menu.productRoot",
        children: [
            {
                path: prefix + "/product",
                title: "menu.product",
            },
            {
                path: prefix + "/product/price-list",
                title: "menu.productPriceList",
            },
        ],
    },
    // Kho 
    {
        icon: <StockIcon/>,
        title: "menu.stockManagement",
        children: [
            {
                path: prefix + "/order/supplier",
                title: "menu.orderSupplier",
                permission: PERMISSION_APP.orderStock.order + " and " + ROLE_PHARMACY,
            },
            {
                path: prefix + "/stock/import",
                permission: PERMISSION_APP.stock.importStock,
                // icon: <ImportIcon/>,
                title: "menu.importStock",
            },
            {
                path: prefix + "/stock/export-supplier",
                permission: PERMISSION_APP.stock.exportSupplier,
                // icon: <ExportIcon/>,
                title: "menu.exportSupplier",
            },
            {
                path: prefix + "/stock/export-cancel",
                permission: PERMISSION_APP.stock.exportCancel,
                // icon: <ExportIcon/>,
                title: "menu.exportCancel",
            },
            {
                path: prefix + "/stock/transfer",
                permission: PERMISSION_APP.stock.transferStock,
                // icon: <TransferIcon/>,
                title: "menu.transferStock",
            },
            {
                path: prefix + "/stock/check",
                permission: PERMISSION_APP.stock.checkStock,
                // icon: <CheckIcon />,
                title: "menu.checkStock",
            },
            {
                path: prefix + "/stock/inventory",
                permission: PERMISSION_APP.stock.inventory,
                // icon: <CheckIcon />,
                title: "menu.inventory",
            },
            {
                path: prefix + "/partner/customer-supplier",
                permission: PERMISSION_APP.stock.supplier,
                title: "menu.customerSupplier",
            },
        ],
    },
    // Thu chi
    {
        path: prefix + "/accountant/cashbook/dashboard",
        icon: <AccountantIcon/>,
        title: "menu.cashbook",
        permission: PERMISSION_APP.accountant.cashbook,
    },
    // Nhân sự
    {
        icon: <PayrollIcon/>,
        title: "menu.human",
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
    // Báo cáo
    {
        path: prefix + "/report",
        icon: <ReportIcon/>,
        title: "menu.report",
        // permission: 'ReportShop',
    },
    // Sản phẩm
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
                path: prefix + "/table",
                title: "menu.fnbTable",
            },
            {
                path: prefix + "/area",
                title: "menu.fnbArea",
            },
            {
                path: prefix + "/processing-area",
                title: "menu.fnbProcessingArea",
            },
            {
                path: prefix + "/system/shop-setting",
                title: "menu.shopSetting",
                permission: PERMISSION_APP.system.shopSetting,
            },
        ],
    },
] as SideNavInterface[];
