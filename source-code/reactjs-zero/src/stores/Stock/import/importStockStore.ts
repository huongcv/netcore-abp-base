import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ImportStockService} from "@api/ImportStockService";

class ImportStockListStore extends CommonListStore<ProductGroupDto> {
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
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }

}

export default ImportStockListStore;
