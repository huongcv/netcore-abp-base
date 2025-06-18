import {ProductBookReportDto, SellReportProductOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {ProductBookService} from "@api/ProductBookService";

class ProductBookStore extends CommonListStore<any> {
    constructor() {
        super();
        makeObservable(this)
    }

    getNamespaceLocale(): string {
        return "reportProductBook"
    }

    apiService() {
        return {
            getPaged: ProductBookService.getPaged,
            exportPagedResult: ProductBookService.exportPagedResult
        } as CommonCrudApi<ProductBookReportDto>;
    }

    getListColumnNameExcel(): string[] {
        return [];
    }
    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'order', 'invoiceCode',
            "invoiceDate", "customerName",
            "customerCode",
            "totalPurchase", "totalPayAgain", "totalRevenue"]
    }

    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: '70%'
        };
    }
}

export default ProductBookStore;
