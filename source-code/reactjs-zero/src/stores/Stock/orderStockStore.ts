import {ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {OrderStockService} from "@api/OrderStockService";

class OrderStockListStore extends CommonListStore<ProductGroupDto> {
    getNamespaceLocale(): string {
        return "orderStock"
    }

    apiService() {
        return OrderStockService as any;
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

export default OrderStockListStore;
