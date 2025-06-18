import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { IRequestOptions, PagedResultDto, PartnerGroupDto } from "@api/index.defs";
import { makeObservable, observable } from "mobx";
import { CommonCreateOrUpdate, CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CustomerGroupService } from "@api/CustomerGroupService";

class CustomerApplyInDetailStore extends CommonListStore<PartnerGroupDto> {
    isShowSelectCustomerGroupModal: boolean = false;
    constructor() {
        super();
        makeObservable(this, {
            isShowSelectCustomerGroupModal: observable,
        })
    }
    getNamespaceLocale(): string {
        return "customer-group"
    }

    apiService() {
        return {
            getPaged: CustomerGroupService.getPagedInPriceListDetail,

        } as CommonCrudApi<PartnerGroupDto>;
    }


    setInitValue(d: PartnerGroupDto) {
        this.isAddNewEntity = false;
        this.entityUpdateData = d;
        this.createOrUpdateModal.entityData = d;
    }

    setIsShowModal(isShow: boolean) {
        this.createOrUpdateModal.visible = isShow;
    }

    setIsShowSelectCustomerModal(isShow: boolean) {
        this.isShowSelectCustomerGroupModal = isShow;
        this.setIsShowModal(!isShow);
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

export default CustomerApplyInDetailStore;
