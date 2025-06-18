import { DoctorGroupService } from "@api/DoctorGroupService";
import { PartnerGroupDto } from "@api/index.defs";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class DoctorGroupStore extends CommonListStore<PartnerGroupDto> {
    getNamespaceLocale(): string {
        return "doctor-group"
    }

    apiService() {
        return DoctorGroupService;
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

export default DoctorGroupStore;
