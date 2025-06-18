import {CountryStateDto, PartnerDto, DebtInfoDto, IRequestOptions, PARTNER_TYPE} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {PartnerTransactionService} from "@api/PartnerTransactionService";
import {makeObservable, observable} from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";
import {AccountMoveService} from "@api/AccountMoveService";
import {l} from "@ord-core/language/lang.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";

class PartnerTransactionStore extends CommonListStore<PartnerDto> {
    constructor() {
        super();
        makeObservable(this, {
            // changeDebtModal: observable,
            changePayModal: observable,
        })
    }

    getNamespaceLocale(): string {
        return "partner_transaction"
    }

    apiService() {
        return {
            getPaged: PartnerTransactionService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                return PartnerTransactionService.createOrUpdate(params, options);
            },
            remove: PartnerTransactionService.remove
        } as CommonCrudApi<PartnerDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            entityData: {
                isActive: true,
                gender: 1
            } as PartnerDto,
            width: '60%'
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    ///#region Pay
    changePayModal: ICreateOrUpdateModal<DebtInfoDto | null> = {
        mode: 'addNew',
        width: '35%',
        visible: false,
    }

    openViewChangePayModal(patientId: number) {
        UiUtils.setBusy();
        AccountMoveService.getPartnerDebtInfo({
            partnerId: patientId,
        }).then(result => {
            UiUtils.clearBusy();
            this.changePayModal.visible = true;
            this.changePayModal.entityData = result; 
            this.changePayModal.entityData.transactionDate = new Date();
            this.changePayModal.mode = 'addNew';
        })

    }

    closeViewChangePayModal(mustRefreshGridData: boolean = false) {
        this.changePayModal.visible = false;
        this.changePayModal.entityData = null;
        if (mustRefreshGridData) {
            this.refreshGridData().then();
        }
    }

    removeRecordDebtPartner(partnerTransId: number) {
        UiUtils.setBusy();
        AccountMoveService.removeDebtByPartnerTransId({
            removeId: partnerTransId
        }, {}).then(result => {
            if (result.isSuccessful) {
                UiUtils.showSuccess(l.trans(this.getNamespaceLocale() + '.removeSuccess', this.removeRecord));
                this.refreshGridData(true).then();
            } else {
                ServiceProxyUtils.notifyErrorResultApi(result, this.getNamespaceLocale(), this.removeRecord);
            }
            this.closeRemoveById();
            UiUtils.clearBusy();
        }, () => {
            this.closeRemoveById();
            UiUtils.clearBusy();
        })

    }

    //
    // cruPayAmount(input: CruCustomerDebtCommand) {
    //     return CustomerService.cruDebt({
    //         body: input
    //     })
    // }

    ///#endregion End Pay
}

export default PartnerTransactionStore;
