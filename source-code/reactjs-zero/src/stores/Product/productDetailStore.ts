import {action, computed, makeObservable, observable} from "mobx";
import {ProductDetailDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {ProductService} from "@api/ProductService";

class ProductDetailStored {
    productDetail: ProductDetailDto | null;

    constructor() {
        makeObservable(this, {
            productDetail: observable,
            getDetail: action,
            productDto: computed,
            units: computed
        });
    }

    async getDetail(idHash: string) {
        UiUtils.setBusy();
        try {
            const result = await ProductService.getDetail({
                idHash: idHash
            });
            this.productDetail = {
                ...result
            };
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    get productDto() {
        return this.productDetail?.productDto;
    }

    get units() {
        return this.productDetail?.listProductUnit;
    }
}

export default ProductDetailStored;
