import {
    IRequestOptions, number,
    ProductGetPagedInputDto, ProductPriceListDetailDto,
    ProductSearchWithUnitDto,
    SaleInvoiceDto, string
} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {ProductGroupService} from "@api/ProductGroupService";
import {ProductService} from "@api/ProductService";
import {NotificationUserService} from "@api/NotificationUserService";
import {action, makeObservable, observable} from "mobx";

class SaleInvoiceStore extends CommonListStore<SaleInvoiceDto> {
    invoiceTabContentData: any = [];
    isShowInfoExportEinvoice: boolean;
    currentPriceListId: string | number | boolean | null;
    viewInvoiceModal: ICreateOrUpdateModal<{
        isInvoiceReturn?: boolean,
        data: SaleInvoiceDto
    }> = {
        visible: false,
        width: 550
    }
    cancelRecord: SaleInvoiceDto | null;

    constructor() {
        super();
        makeObservable(this, {
            currentPriceListId: observable,
            isShowInfoExportEinvoice: observable,
            viewInvoiceModal: observable,
            cancelRecord: observable,
            closeViewInvoiceModal: action,
            openViewInvoiceModal: action,
        })
    }

    openCancelById(removeRecord: SaleInvoiceDto) {
        this.cancelRecord = {
            ...removeRecord,
        };
    }

    closeCancelById() {
        this.cancelRecord = null;
    }

    openViewInvoiceModal(data: SaleInvoiceDto, isInvoiceReturn?: boolean) {
        this.viewInvoiceModal = {
            visible: true,
            mode: "viewDetail",
            entityData: {
                isInvoiceReturn: isInvoiceReturn,
                data: data
            },
            width: 550,
        }
    }

    closeViewInvoiceModal() {
        this.viewInvoiceModal.visible = false;
        this.viewInvoiceModal.entityData = null;
    }

    getNamespaceLocale(): string {
        return "sale-invoice"
    }

    apiService() {
        return {
            getPaged: SaleInvoiceService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
            },
            remove: SaleInvoiceService.remove
        } as CommonCrudApi<SaleInvoiceDto>;
    }

    getListProductGroup() {
        return ProductGroupService.getPaged({
            body: {
                skipCount: 0,
                maxResultCount: 1000,
                isActived: true
            }
        });
    }

    getListProduct(input: ProductGetPagedInputDto) {
        return ProductService.getPaged({body: input})
    }

    create(input: SaleInvoiceDto) {
        return SaleInvoiceService.create({body: input})
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    // exportEinvoice(inputs: SaleInvoiceDto[]) {
    //     return SaleInvoiceService.s();
    // }

    getListColumnNameExcel(): string[] {
        return ['stt', 'invoiceCode', 'dateRange', 'partnerName', 'productAmount', 'payment', 'status']
    }

    override async beforeSaveEntity(input: SaleInvoiceDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default SaleInvoiceStore;
