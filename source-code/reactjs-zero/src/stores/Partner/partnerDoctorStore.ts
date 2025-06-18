import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {IRequestOptions, PartnerDto} from "@api/index.defs";
import {makeObservable, observable} from "mobx";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {PartnerDoctorService} from "@api/PartnerDoctorService";

class PartnerDoctorStore extends CommonListStore<PartnerDto> {
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
        return "partner-doctor"
    }

    apiService() {
        return {
            exportPagedResult: PartnerDoctorService.exportPagedResult,
            getPaged: PartnerDoctorService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (params.body.visaNo) {
                    params.body.visaNo = "" + params.body.visaNo;
                }
                params.body.type = 6;
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return PartnerDoctorService.createOrUpdate(params, options)
                }
                return PartnerDoctorService.createOrUpdate(params, options);
            },
            remove: PartnerDoctorService.remove
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
        return ['stt', "code", "name", "phone", "email", "debtAmount", "isActived"]
    }

}

export default PartnerDoctorStore;
