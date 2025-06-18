import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ShopPackageRegistrationDto} from "@api/index.defs";
import {ShopPackageRegistrationService} from "@api/ShopPackageRegistrationService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";

class PackageForTenantStore extends CommonListStore<ShopPackageRegistrationDto> {
    getNamespaceLocale(): string {
        return "packageRegistration"
    }

    apiService() {
        return {
            getPaged: ShopPackageRegistrationService.getPaged,
        } as CommonCrudApi<ShopPackageRegistrationDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 992
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

}

export default  PackageForTenantStore;
