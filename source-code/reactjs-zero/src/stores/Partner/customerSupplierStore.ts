import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CountryStateDto, PartnerDto, IRequestOptions} from "@api/index.defs";
import {makeObservable, observable} from "mobx";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import { SupplierService } from "@api/SupplierService";

class CustomerSupplierStore extends CommonListStore<PartnerDto> {
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
        return "customer-supplier"
    }

    apiService() {
        return {
            exportPagedResult: SupplierService.exportPagedResult,
            getPaged: SupplierService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (params.body.visaNo) {
                    params.body.visaNo = "" + params.body.visaNo;
                }
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return SupplierService.createOrUpdate(params, options)
                }
                return SupplierService.createOrUpdate(params, options);
            },
            remove: SupplierService.remove
        } as CommonCrudApi<PartnerDto>;
    }

    getInitModal(): ICreateOrUpdateModal<PartnerDto> {
        return {
            entityData: {
                isActived: true,
                gender: 1
            },
            width: '80%'
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', "code", "name", "phone", "email","debtAmount", "isActived"]
    }

    override async beforeSaveEntity(input: CountryStateDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default CustomerSupplierStore;
