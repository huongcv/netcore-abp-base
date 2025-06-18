import {OrderStockTicketDto, ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {OrderStockService} from "@api/OrderStockService";
import {GdpOrderStockService} from "@api/GdpOrderStockService";

class GdpOrderStockListStore extends CommonListStore<OrderStockTicketDto> {
    getNamespaceLocale(): string {
        return "gdpOrderStock"
    }

    apiService() {
        return GdpOrderStockService as any;
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

export default GdpOrderStockListStore;
