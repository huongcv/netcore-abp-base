import {CountryStateDto, IRequestOptions} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {CountryStateService} from "@api/CountryStateService";

class CountryStateStore extends CommonListStore<CountryStateDto> {
    getNamespaceLocale(): string {
        return "country-state"
    }

    apiService() {
        return {
            getPaged: CountryStateService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return CountryStateService.createOrUpdate(params, options);
                }
                return CountryStateService.createOrUpdate(params, options);
            },
            remove: CountryStateService.remove
        } as CommonCrudApi<CountryStateDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: CountryStateDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default CountryStateStore;
