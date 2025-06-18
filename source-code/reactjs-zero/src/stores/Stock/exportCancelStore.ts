import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ExportCancelService} from "@api/ExportCancelService";

class ExportCancelListStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "stock"
    }

    apiService() {
        return ExportCancelService as any;
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

export default ExportCancelListStore;
