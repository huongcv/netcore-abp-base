import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {ProductUnitService} from "@api/ProductUnitService";


class ProductUnitStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "product-unit"
    }

    apiService(): CommonCrudApi<any> {
        return {
            createOrUpdate: ProductUnitService.updateListUnit
        } as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 888
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }

}

export default ProductUnitStore;
