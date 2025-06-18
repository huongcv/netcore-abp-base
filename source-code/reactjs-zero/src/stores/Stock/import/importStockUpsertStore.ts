import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ImportStockService} from "@api/ImportStockService";
import {makeObservable, observable} from "mobx";

class ImportStockUpsertStore extends CommonListStore<ProductGroupDto> {
    productItems: any[] = [];
    productDetail: any = {};

    constructor() {
        super();
        makeObservable(this, {
            productItems: observable,
            productDetail: observable,
        });
    }

    getNamespaceLocale(): string {
        return "stock"
    }

    apiService() {
        return ImportStockService as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return []
    }

}

export default ImportStockUpsertStore;
