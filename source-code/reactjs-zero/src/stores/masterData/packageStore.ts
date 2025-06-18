import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {IRequestOptions, PackageDto} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {PackageService} from "@api/PackageService";

class PackageStore extends CommonListStore<PackageDto> {
    getNamespaceLocale(): string {
        return "package"
    }

    apiService() {
        return {
            getPaged: PackageService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return PackageService.createOrUpdate(params, options);
                }
                return PackageService.createOrUpdate(params, options);
            },
            remove: PackageService.remove
        } as CommonCrudApi<PackageDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

}

export default PackageStore;
