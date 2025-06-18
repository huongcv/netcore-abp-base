import {
    IRequestOptions,
    ProductGetPagedInputDto,
    SaleInvoiceDto
} from "@api/index.defs";
import {ProductGroupService} from "@api/ProductGroupService";
import {ProductService} from "@api/ProductService";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {makeObservable, observable} from "mobx";

export interface IPaymentCentralBillingCruParam {
    partnerId?: string;
    mainInvoiceId?: string;
    listInvoiceId?: string[];
    paymentPartnerId?: string;
    partnerName?: string,
    /** Hàm lưu tùy chỉnh, ví dụ override lưu hóa đơn */
    customSave?: (res: SaleInvoiceDto, callBackSuccess: (data:SaleInvoiceDto)=>void) => void
}

class PaymentCentralBillingStore extends CommonListStore<SaleInvoiceDto, IPaymentCentralBillingCruParam> {
    currentPriceListId: string | number | boolean | null;

    constructor() {
        super();
        makeObservable(this, {
            currentPriceListId: observable,
        })
    }

    getNamespaceLocale(): string {
        return "checkout"
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

    getListColumnNameExcel(): string[] {
        return []
    }

    override async beforeSaveEntity(input: SaleInvoiceDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default PaymentCentralBillingStore;
