import {IRequestOptions, ShopDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ShopService} from "@api/ShopService";

class ShopListStore extends CommonListStore<ShopDto> {
    getNamespaceLocale(): string {
        return "shop-list"
    }
    apiService() {
        return {
            getPaged: ShopService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === "update") {
                    params.body.packageRegistrationId = null;
                }
                return ShopService.createOrUpdate(params, options);
            },
            remove: ShopService.remove,
            exportPagedResult: ShopService.exportPagedResult,
        };
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'PhoneNumber', 'Email', 'address', 'status']
    }
}

export default ShopListStore;
