import {ProductBookReportDto, SellReportProductOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {ProductBookService} from "@api/ProductBookService";
import {ProductRevenueBookService} from "@api/ProductRevenueBookService";

class ProductRevenueBookStore extends CommonListStore<any> {
    constructor() {
        super();
        makeObservable(this)
    }

    getNamespaceLocale(): string {
        return "reportProductRevenueBook"
    }

    apiService() {
        return {
            getPaged: ProductRevenueBookService.getPaged,
            exportPagedResult: ProductRevenueBookService.exportPagedResult
        } as CommonCrudApi<ProductBookReportDto>;
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: '70%'
        };
    }
}

export default ProductRevenueBookStore;
