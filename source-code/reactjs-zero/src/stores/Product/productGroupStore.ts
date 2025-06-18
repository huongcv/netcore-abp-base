import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ProductGroupService} from "@api/ProductGroupService";

class ProductGroupListStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "product-group-list"
    }

    apiService() {
        return ProductGroupService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'Notes', 'isActived']
    }

}

export default ProductGroupListStore;
