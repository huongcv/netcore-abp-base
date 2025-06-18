import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { IRequestOptions } from "@api/index.defs";
import { ReservationService } from "@api/ReservationService";

class ReservationStore extends CommonListStore<any> {
    getNamespaceLocale(): string {
        return "reservation"
    }

    apiService() {
        return {
            createOrUpdate: (params: any, options: IRequestOptions) => {
                if (!params.body?.id) {
                    return ReservationService.create(params, options);
                } else {
                    return ReservationService.update(params, options);
                }
            },
            getPaged: ReservationService.getPaged,
        } as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 576
        };
    }

    getListColumnNameExcel(): string[] {
        return []
    }

}

export default ReservationStore;
