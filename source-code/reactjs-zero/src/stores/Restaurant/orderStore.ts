import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {OrderRestaurantService} from "@api/OrderRestaurantService";

class OrderStore extends CommonListStore<any> {
    getNamespaceLocale(): string {
        return "order"
    }

    apiService(): CommonCrudApi<any> {
        return {
            getPaged: OrderRestaurantService.getPagedOrder,
        } as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '90%'
        };
    }

    getListColumnNameExcel(): string[] {
        return []
    }

}

export default OrderStore;
