import {DistrictDto, IRequestOptions} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {DistrictService} from "@api/DistrictService";

class DistrictStore extends CommonListStore<DistrictDto> {

    getNamespaceLocale(): string {
        return "district"
    }

    apiService() {
        return {
            getPaged: DistrictService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return DistrictService.createOrUpdate(params, options);
                }
                return DistrictService.createOrUpdate(params, options);
            },
            remove: DistrictService.remove
        } as CommonCrudApi<DistrictDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: DistrictDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default DistrictStore;
