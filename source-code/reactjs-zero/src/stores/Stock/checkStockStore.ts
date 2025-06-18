import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CheckStockService} from "@api/CheckStockService";

class CheckStockListStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "stock"
    }

    apiService() {
        return CheckStockService as any;
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

export default CheckStockListStore;
