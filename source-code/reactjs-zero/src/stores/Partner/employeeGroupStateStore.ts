import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { PartnerGroupDto } from "@api/index.defs";
import { PartnerGroupService } from "@api/PartnerGroupService";
import { makeObservable, observable } from "mobx";
import { CustomerGroupService } from "@api/CustomerGroupService";
import { EmployeeGroupService } from "@api/EmployeeGroupService";

class EmployeeGroupStore extends CommonListStore<PartnerGroupDto> {
    getNamespaceLocale(): string {
        return "employee-group"
    }

    apiService() {
        return EmployeeGroupService;
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

export default EmployeeGroupStore;
