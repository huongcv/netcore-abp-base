import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {PartnerGroupDto} from "@api/index.defs";
import {PartnerGroupService} from "@api/PartnerGroupService";
import {makeObservable, observable} from "mobx";
import { CustomerGroupService } from "@api/CustomerGroupService";

class CustomerGroupStore extends CommonListStore<PartnerGroupDto> {
    getNamespaceLocale(): string {
        return "customer-group"
    }

    apiService() {
        return CustomerGroupService;
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

export default CustomerGroupStore;
