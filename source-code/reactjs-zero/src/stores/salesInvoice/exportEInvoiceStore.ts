import {
    IRequestOptions,
    SaleInvoiceDto,
    SaleInvoiceGetListDto
} from "@api/index.defs";
import { SaleInvoiceService } from "@api/SaleInvoiceService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { action, makeObservable, observable } from "mobx";

class ExportEInvoiceStore extends CommonListStore<SaleInvoiceDto> {
    isShowExportModal: boolean;
    isShowExportMergeModal: boolean;
    selectedRowKeys: string[] = [];
    selectedRows: SaleInvoiceDto[] = [];

    constructor() {
        super();
        makeObservable(this, {
            isShowExportModal: observable,
            isShowExportMergeModal: observable,
            selectedRowKeys: observable,
            selectedRows: observable,
            setSelectedRows: action,
        })
    }

    getNamespaceLocale(): string {
        return "sale-invoice"
    }

    apiService() {
        return {
            getPaged: (params: { body: SaleInvoiceGetListDto }, options: IRequestOptions) => {
                params.body.showUnexportedEInvoices = true; 
                return SaleInvoiceService.getPaged(params)
            },
            createOrUpdate: (params, options: IRequestOptions) => {
            },
            remove: SaleInvoiceService.remove
        } as CommonCrudApi<SaleInvoiceDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'invoiceCode', 'dateRange', 'partnerName', 'productAmount', 'payment', 'status']
    }

    setSelectedRows(invoice: SaleInvoiceDto[]) {
        let newItems = this.selectedRows || [];
        let itemInPage: SaleInvoiceDto[] = this.currentPageResult?.items || [];
        let idInPage = itemInPage.map(it => it.id);
        newItems = newItems.filter(it => {
            return idInPage.indexOf(it.id) < 0;
        });
        newItems = [...newItems, ...invoice];

        this.selectedRows = [...newItems];
        this.getSelectedRowKeys();
    }

    private getSelectedRowKeys() {
        this.selectedRowKeys = this.selectedRows.filter(x => !!x.id)
            .map(it => it.id || '');
    }

    override async beforeSaveEntity(input: SaleInvoiceDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default ExportEInvoiceStore;
