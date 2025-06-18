import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {ProductStockService} from "@api/ProductStockService";

class ProductInventoryMoveListStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "stock"
    }

    apiService(): CommonCrudApi<any> {
        const getPage = async (formSearch: any) => {
            const response = await ProductStockService.getInventoryMovePaged(formSearch)
            if(!response.isSuccessful) {
                return {};
            }

            return response.data?.pageItems;
        }

        return {
            getPaged: getPage
        } as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }

}

export default ProductInventoryMoveListStore;
