import { PartnerGroupDto } from "@api/index.defs";
import { SupplierGroupService } from "@api/SupplierGroupService";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class SupplierGroupStore extends CommonListStore<PartnerGroupDto> {
    getNamespaceLocale(): string {
        return "supplier-group"
    }

    apiService() {
        return SupplierGroupService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600,
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'GroupCode', 'GroupName', 'GroupType', 'Notes', 'Status']
    }
}

export default SupplierGroupStore;
