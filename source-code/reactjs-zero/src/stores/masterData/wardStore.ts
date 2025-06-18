import {IRequestOptions, WardDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {WardService} from "@api/WardService";

class WardStore extends CommonListStore<WardDto> {
    getNamespaceLocale(): string {
        return "ward"
    }

    apiService() {
        return {
            getPaged: WardService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return WardService.createOrUpdate(params, options);
                }
                return WardService.createOrUpdate(params, options);
            },
            remove: WardService.remove
        } as CommonCrudApi<WardDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: WardDto, isAddNew: boolean): Promise<any> {

        return input;
    }
}

export default WardStore;
