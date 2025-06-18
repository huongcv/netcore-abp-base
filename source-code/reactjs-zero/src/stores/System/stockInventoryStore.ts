import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {IRequestOptions, StockInventoryDto} from "@api/index.defs";
import {StockInventoryService} from "@api/StockInventoryService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";

class StockInventoryStore extends CommonListStore<StockInventoryDto> {
    getNamespaceLocale(): string {
        return "stock"
    }

    apiService() {
        return {
            getPaged: StockInventoryService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return StockInventoryService.createOrUpdate(params, options)
                }
                return StockInventoryService.createOrUpdate(params, options);
            },
            remove: (params, options) => {
            return StockInventoryService.remove({
                removeHashId: params.removeId
            }, options);
        },
        } as CommonCrudApi<StockInventoryDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'GroupCode', 'GroupName', 'GroupType' , 'Notes', 'Status']
    }
}

export default StockInventoryStore;
