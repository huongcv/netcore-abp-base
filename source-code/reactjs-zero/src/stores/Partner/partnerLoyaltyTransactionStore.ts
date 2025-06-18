import { CustomerService } from "@api/CustomerService";
import { PartnerDto, PartnerLoyaltyTransactionDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore } from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class PartnerLoyaltyTransactionStore extends CommonListStore<PartnerLoyaltyTransactionDto> {
    isShowExcelModal: boolean = false;

    constructor() {
        super();
        makeObservable(this, {
            isShowExcelModal: observable
        })
    }

    setIsShowExcelModal(isShow: boolean) {
        this.isShowExcelModal = isShow;
    }


    getNamespaceLocale(): string {
        return "customer"
    }

    apiService() {
        return {
            getPaged: CustomerService.getLoyaltyTransaction,
        } as CommonCrudApi<PartnerDto>;
    }

    getInitModal() {
        return {
            width: '80%'
        };
    }

    getListColumnNameExcel(): string[] {
        return []
    }

}

export default PartnerLoyaltyTransactionStore;
