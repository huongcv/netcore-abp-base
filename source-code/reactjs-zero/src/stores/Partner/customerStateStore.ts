import {CountryStateDto, PartnerDto, IRequestOptions} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {CustomerService} from "@api/CustomerService";
import {makeObservable, observable} from "mobx";

export interface IChangeCustomerDebt {
    partnerId?: string | undefined,
    partnerCode: string | undefined,
    partnerName: string | undefined,

    transactionId?: string | undefined,
    transactionDate: Date,
    currentDebtAmount: number | undefined;
    amount: number | undefined; ///DebtAmount
}


class CustomerStore extends CommonListStore<PartnerDto> {
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
            exportPagedResult: CustomerService.exportPagedResult,
            getPaged: CustomerService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (params.body.visaNo) {
                    params.body.visaNo = "" + params.body.visaNo;
                }
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return CustomerService.createOrUpdate(params, options)
                }
                return CustomerService.createOrUpdate(params, options);
            },
            remove: CustomerService.remove
        } as CommonCrudApi<PartnerDto>;
    }

    getInitModal(): ICreateOrUpdateModal<PartnerDto> {
        return {
            entityData: {
                isActived: true,
                categoryId: 1,
                type: 1,
                gender: 1
            },
            width: '80%'
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', "code", "name", "phone", "email", "gender", "debtAmount", "isActived"]
    }

    override async beforeSaveEntity(input: CountryStateDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default CustomerStore;
