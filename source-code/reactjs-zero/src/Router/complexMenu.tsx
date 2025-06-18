import {SolutionOutlined, UserSwitchOutlined} from "@ant-design/icons";
import {AccountantIcon} from "@ord-components/icon/menu/AccountantIcon";
import {DashboardIcon} from "@ord-components/icon/menu/DashboardIcon";
import {InvoiceIcon} from "@ord-components/icon/menu/InvoiceIcon";
import {PayrollIcon} from "@ord-components/icon/menu/PayrollIcon";
import {ProductIcon} from "@ord-components/icon/menu/ProductIcon";
import {ReportIcon} from "@ord-components/icon/menu/ReportIcon";
import {SaleIcon} from "@ord-components/icon/menu/SaleIcon";
import {SettingIcon} from "@ord-components/icon/menu/SettingIcon";
import {StockIcon} from "@ord-components/icon/menu/StockIcon";
import {AppExtendCode, ROLE_PHARMACY} from "@ord-core/AppConst";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {SideNavInterface} from "@ord-core/model/side-nav.type";

export default [
    {
        path: AppExtendCode.proShop + "/dashboard",
        icon: <DashboardIcon/>,
        title: "menu.dashboard",
        permission: 'DashboardTenant'
    },
    {
        icon: <SaleIcon style={{width: 20}}/>,
        title: "menu.sell",
        path: "/sales-invoice/sell",
        permission: PERMISSION_APP.saleInvoice.sell,
    },
    {
        icon: <InvoiceIcon/>,
        title: "menu.saleInvoice",
        path: AppExtendCode.proShop + "/sales-invoice/invoice",
        permission: PERMISSION_APP.saleInvoice.invoice,
    },
    // {
    //     icon: <SolutionOutlined style={{fontSize: "20px"}}/>,
    //     title: "menu.order",
    //     path: AppExtendCode.proShop + "/order/customer",
    //     permission: PERMISSION_APP.orderStock.order + " and " + ROLE_PHARMACY,
    // },
    {
        icon: <SolutionOutlined style={{fontSize: "20px"}}/>,
        title: "menu.order",
        path: AppExtendCode.proShop + "/sale/order",
       permission: PERMISSION_APP.orderStock.order + " and " + ROLE_PHARMACY,
    },
    {
        icon: <UserSwitchOutlined style={{fontSize: "20px"}}/>,
        title: "menu.customer",
        path: AppExtendCode.proShop + "/partner/customer",
        permission: PERMISSION_APP.customer.viewCustomerList,
    },
    {
        icon: <StockIcon/>,
        title: "menu.stockManagement",
        children: [
            {
                path: AppExtendCode.proShop + "/order/supplier",
                title: "menu.orderSupplier",
                permission: PERMISSION_APP.orderStock.order + " and " + ROLE_PHARMACY,
            },
            {
                path: AppExtendCode.proShop + "/stock/import",
                permission: PERMISSION_APP.stock.importStock,
                // icon: <ImportIcon/>,
                title: "menu.importStock",
            },
            {
                path: AppExtendCode.proShop + "/stock/export-supplier",
                permission: PERMISSION_APP.stock.exportSupplier,
                // icon: <ExportIcon/>,
                title: "menu.exportSupplier",
            },
            {
                path: AppExtendCode.proShop + "/stock/export-cancel",
                permission: PERMISSION_APP.stock.exportCancel,
                // icon: <ExportIcon/>,
                title: "menu.exportCancel",
            },
            {
                path: AppExtendCode.proShop + "/stock/transfer",
                permission: PERMISSION_APP.stock.transferStock,
                // icon: <TransferIcon/>,
                title: "menu.transferStock",
            },
            {
                path: AppExtendCode.proShop + "/stock/check",
                permission: PERMISSION_APP.stock.checkStock,
                // icon: <CheckIcon />,
                title: "menu.checkStock",
            },
            {
                path: AppExtendCode.proShop + "/stock/inventory",
                permission: PERMISSION_APP.stock.inventory,
                // icon: <CheckIcon />,
                title: "menu.inventory",
            },
            {
                path: AppExtendCode.proShop + "/partner/customer-supplier",
                permission: PERMISSION_APP.stock.supplier,
                title: "menu.customerSupplier",
            },
        ],
    },

    // {
    //   icon: <PartnerIcon />,
    //   title: "menu.partner",
    //   children: [
    //
    //
    //   ],
    // },
    {
        path: AppExtendCode.proShop + "/accountant/cashbook/dashboard",
        icon: <AccountantIcon/>,
        title: "menu.cashbook",
        permission: PERMISSION_APP.accountant.cashbook,
    },
    {
        icon: <ProductIcon/>,
        title: "menu.productRoot",
        children: [
            {
                path: AppExtendCode.proShop + "/product",
                permission: PERMISSION_APP.product.product,
                title: "menu.product",
            },
            {
                path: AppExtendCode.proShop + "/product/price-list",
                title: "menu.productPriceList",
                permission: PERMISSION_APP.product.productPriceList,
            },
            // {
            //      path: "/product/discount",
            //      title: "menu.productDiscount",
            //      permission: PERMISSION_APP.product.productDiscount,
            //  },
            //  {
            //      path: "/product/sales-promotion",
            //      title: "menu.salespromotion",
            //      permission: PERMISSION_APP.product.salesPromotion,
            //  }
        ],
    },

    {
        icon: <PayrollIcon/>,
        title: "menu.human",
        children: [
            {
                path: AppExtendCode.proShop + "/human-resource/employee",
                title: "menu.employee",
                permission: PERMISSION_APP.human.employee + ".GetPaged",
            },
            {
                path: AppExtendCode.proShop + "/human-resource/work-calendar",
                title: "menu.workCalendar",
                permission: PERMISSION_APP.human.workCalendar,
            },
            {
                path: AppExtendCode.proShop + "/human-resource/allowance",
                title: "menu.allowance",
                permission: PERMISSION_APP.human.allowance,
            },
            {
                path: AppExtendCode.proShop + "/human-resource/timekeeping",
                title: "menu.timekeeping",
                permission: PERMISSION_APP.human.employeeTimekeeping,
            },
            {
                path: AppExtendCode.proShop + "/human-resource/timesheet",
                title: "menu.timesheet",
                permission: PERMISSION_APP.human.timesheet,
            },
            {
                path: AppExtendCode.proShop + "/human-resource/payroll",
                title: "menu.payroll",
                permission: PERMISSION_APP.human.employeePayroll,
            },
        ],
    },

    {
        path: AppExtendCode.proShop + "/report",
        icon: <ReportIcon/>,
        title: "menu.report",
        // permission: 'ReportShop',  ???? Quyền tại lấy trong PERMISSION_APP????
    },

    {
        icon: <SettingIcon/>,
        title: "menu.admin",
        children: [
            {
                path: AppExtendCode.proShop + "/system/user",
                title: "menu.userEmployee",
                permission: PERMISSION_APP.system.user,
            },
            {
                path: AppExtendCode.proShop + "/system/roles",
                permission: PERMISSION_APP.system.role,
                title: "menu.role",
            },
            {
                path: AppExtendCode.proShop + "/partner/doctor",
                permission: PERMISSION_APP.system.doctor + " and " + ROLE_PHARMACY,
                title: "menu.partnerDoctor",
            },
            // {
            //     path: "/system/stock-inventory",
            //     title: "menu.stockInventory",
            //     permission: PERMISSION_APP.admin.stockInventory,
            // },
            {
                path: AppExtendCode.proShop + "/template-printer",
                title: "menu.templatePrinterTenant",
                permission: PERMISSION_APP.admin.templatePrinterTenant,
            },
            {
                path: AppExtendCode.proShop + "/system/transfer-national-pharmacy",
                title: "menu.transferNationalPharmacy",
                permission: PERMISSION_APP.system.transferNationalPharmacy,
                keyCheck: 999
            },
            {
                path: AppExtendCode.proShop + "/system/shop-setting",
                title: "menu.shopSetting",
                permission: PERMISSION_APP.system.shopSetting,
            },

            // {
            //   path: "/system/shop-template",
            //   title: "menu.shopTemplate",
            //   permission: PERMISSION_APP.admin.shopTemplate,
            // },
            /*  {
                  path: "/system/sample-sales-order",
                  title: "menu.shopSampleSalesOrder",
                  permission: PERMISSION_APP.admin.shopTemplate,
              },
              {
                  path: "/system/sample-receipt",
                  title: "menu.sampleReceipt",
                  permission: PERMISSION_APP.admin.shopTemplate,
              },*/
        ],
    },
] as SideNavInterface[];
