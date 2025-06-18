import SaleInvoiceStore from "@ord-store/salesInvoice/saleInvoiceStore";
import InvoiceReturnStore from "@ord-store/salesInvoice/invoiceReturnStore";
import EinvoiceStore from "@ord-store/salesInvoice/einvoiceStore";
import ExportEInvoiceStore from "./exportEInvoiceStore";
import InvoiceSettingStore from "@ord-store/salesInvoice/InvoiceSettingStore";

export const saleInvoicePart = {
    saleInvoiceStore: new SaleInvoiceStore(),
    invoiceReturnStore: new InvoiceReturnStore(),
    einvoiceStore: new EinvoiceStore(),
    exportEInvoiceStore: new ExportEInvoiceStore(),
    invoiceSettingStore: new InvoiceSettingStore()
}
