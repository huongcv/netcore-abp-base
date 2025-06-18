import {ProductImportDto} from "@api/index.defs";
import {action, computed, makeObservable, observable} from "mobx";

class ProductImportExcelStore {
    constructor() {
        makeObservable(this, {
            listSuccess: observable,
            listError: observable,
            // productDetail: observable,
            // validate: action,
            validCount: computed,
            inValidCount: computed,
            // openDetail: action
        });
    }

    listSuccess: ProductImportDto[] = []
    listError: ProductImportDto[] = [];

    get validCount() {
        return this.listSuccess.length || 0;
    }

    get inValidCount() {
        return this.listError.length || 0;
    }

}

export default ProductImportExcelStore;
