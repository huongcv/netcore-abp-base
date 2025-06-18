import {
    SaleInvoiceDto
} from "@api/index.defs";
import {EinvoiceService} from "@api/EinvoiceService";

class EinvoiceStore {
    getNamespaceLocale(): string {
        return "sale-invoice"
    }
    exportSingleEinvoices(inputs: SaleInvoiceDto[]) {
        // debugger
        // return EinvoiceService.create({ body: inputs });
    }

}

export default EinvoiceStore;
