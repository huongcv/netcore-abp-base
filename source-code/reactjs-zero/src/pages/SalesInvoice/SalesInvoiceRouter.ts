import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";
export const SalesInvoiceRouter: OrdRouterItem[] = [
    {
        path: '/sales-invoice/sell',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/Sell')),
        permission: PERMISSION_APP.saleInvoice.sell,
        isEmptyLayout: true
    },
    {
        path: AppExtendCode.proShop +'/sales-invoice/invoice',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/Invoice')),
        permission: PERMISSION_APP.saleInvoice.invoice
    },
    {
        path: AppExtendCode.proShop + '/sales-invoice/invoice-return',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/InvoiceReturn')),
        permission: PERMISSION_APP.saleInvoice.invoiceReturn
    },

    {
        path: AppExtendCode.proShop +'/sales-invoice/log-api',
        lazyComponent: lazy(() => import('@pages/SalesInvoice/Invoice/LogApi/Index')),
        // permission: PERMISSION_APP.saleInvoice.logApi
    }
]
