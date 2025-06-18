import {InvoiceReturnDto, IRequestOptions, SaleInvoiceDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {InvoiceReturnService} from "@api/InvoiceReturnService";

class InvoiceReturnStore extends CommonListStore<InvoiceReturnDto> {

    getNamespaceLocale(): string {
        return "sale-invoice"
    }

    apiService() {
        return {
            //exportPagedResult: InvoiceReturnService.exportInvoiceReturnResult,
            getPaged: InvoiceReturnService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                // if (this.createOrUpdateModal.mode === 'addNew') {
                //     return SaleInvoiceService.createOrUpdate(params, options);
                // }
                // return SaleInvoiceService.createOrUpdate(params, options);
            },
            remove: InvoiceReturnService.remove
        } as CommonCrudApi<SaleInvoiceDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'moveCode', 'partnerName', 'stockInventory', 'totalAmount', 'payment', 'status']
    }

    override async beforeSaveEntity(input: SaleInvoiceDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default InvoiceReturnStore;
