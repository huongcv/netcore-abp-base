import { NationalPharmacyIntegrationDto } from "@api/index.defs";
import { IntegrateService } from "@api/IntegrateService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class NationalPharmacyStore extends CommonListStore<NationalPharmacyIntegrationDto> {
    getNamespaceLocale(): string {
        return "integration"
    }

    apiService() {
        return {
            getPaged: IntegrateService.getNationalPharmacyIntegrationPaging
        } as CommonCrudApi<NationalPharmacyIntegrationDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600,
        };
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default NationalPharmacyStore;