import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {TransferStockService} from "@api/TransferStockService";

class TransferStockListStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "stock"
    }

    apiService() {
        return TransferStockService as any;
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

export default TransferStockListStore;
