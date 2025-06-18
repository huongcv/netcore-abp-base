import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ExportStockService} from "@api/ExportStockService";

class ExportStockListStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "stock"
    }

    apiService() {
        return ExportStockService as any;
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

export default ExportStockListStore;
