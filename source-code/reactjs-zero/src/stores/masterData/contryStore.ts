import {CountryDto, IRequestOptions} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {CountryService} from "@api/CountryService";

class CountryStore extends CommonListStore<CountryDto> {
    getNamespaceLocale(): string {
        return "country"
    }

    apiService() {
        return {
            getPaged: CountryService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return CountryService.createOrUpdate(params, options);
                }
                return CountryService.createOrUpdate(params, options);
            },
            remove: CountryService.remove
        } as CommonCrudApi<CountryDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: CountryDto, isAddNew: boolean): Promise<any> {
        if (!input.imageUrl) {
            input.imageUrl = ""
        }
        return input;
    }
}

export default CountryStore;
