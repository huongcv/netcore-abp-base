import {
    ACCOUNT_MOVE_TYPE,
    AccountMoveDto,
    IRequestOptions,
    MOVE_STATUS, MOVE_TYPE,
    SummaryPaggingAcountMove
} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {AccountMoveService} from "@api/AccountMoveService";
import {makeObservable, observable} from "mobx";
import {ITopTableFilterData} from "@ord-components/table/TopTableFilter";
import _ from "lodash";

class CashbookStore extends CommonListStore<AccountMoveDto, AccountMoveDto> {
    // partnerDebtInfo: DebtInfo_DetailsDto[] = [];
    summaryCashBook: SummaryPaggingAcountMove[];
    status: MOVE_STATUS|-1 = -1;
    getNamespaceLocale(): string {
        return "cashbook"
    }

    // cruType: ACCOUNT_MOVE_TYPE;

    constructor() {
        super();
        makeObservable(this, {
            summaryCashBook: observable
            // cruType: observable,
            // partnerDebtInfo: observable,
        })
    }
    setSummaryCashBook(){
        AccountMoveService.summaryAcountMove({
            body: this.searchDataState
        }).then(res=>{
            const def: SummaryPaggingAcountMove[] = [
                {
                    status: undefined,
                    strStatus:"List",
                    count: _.sumBy(res, x=>x.count??0)
                }
            ]
                this.summaryCashBook =def.concat(res) ;
        });
    }
    setMoveStatus(val :MOVE_STATUS|-1){
        this.status=  val;
    }

    apiService() {
        return {
            getPaged: AccountMoveService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return AccountMoveService.cruAcountMove(params, options);
                }
                return AccountMoveService.cruAcountMove(params, options);
            },
            // remove: AccountMoveService.deleteAcountMove
        } as CommonCrudApi<AccountMoveDto>;
    }

    openCashBookModal(cruType: ACCOUNT_MOVE_TYPE) {
        // this.cruType = cruType;
        this.createOrUpdateModal.visible = true;
        this.createOrUpdateModal.entityData = {
            ...this.getInitModal().entityData,
            isIncludedFinancialReport: true,
            accountMoveType: cruType
        };
        this.createOrUpdateModal.mode = 'addNew';
    }

    openViewCashBookModal(input: AccountMoveDto) {
        // this.cruType = input.accountMoveType;
        // this.openUpdateModal();
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            entityData: {
                paymentMethod: 1,
                isIncludedFinancialReport: true,
                accountMoveDate: new Date()
            } as AccountMoveDto,
            width: '45%'
        };
    }

    openViewDetailModal(entityData: AccountMoveDto) {
        AccountMoveService.getDebtDetailsInAccMove({
            accountMoveId: parseInt(entityData?.id ?? "0")
        }).then(res => {
            entityData.debtDetails = res;
            super.openViewDetailModal(entityData);
        })
    }

    getPartnerDebtInfo(partnerId: number) {
        return AccountMoveService.getPartnerDebtInfo({
            partnerId: partnerId,
        })
    }


    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: AccountMoveDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default CashbookStore;
