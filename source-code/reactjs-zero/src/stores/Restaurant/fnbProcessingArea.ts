import { FnbAreaService } from "@api/FnbAreaService";
import { FnbProcessingAreaService } from "@api/FnbProcessingAreaService";
import { FnbAreaDto, FnbProcessingAreaDto, IRequestOptions } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class FnbProcessingAreaStore extends CommonListStore<FnbProcessingAreaDto> {
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
        return "fnb-processing-area"
    }

    apiService() {
        return {
            getPaged: FnbProcessingAreaService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return FnbProcessingAreaService.createOrUpdate(params, options)
                }
                return FnbProcessingAreaService.createOrUpdate(params, options);
            },
            remove: FnbProcessingAreaService.remove
        } as CommonCrudApi<FnbAreaDto>;
    }

    getInitModal(): ICreateOrUpdateModal<FnbAreaDto> {
        return {
            entityData: {
                isActived: true,
            },
            width: '30%'
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', "name", "isActived"]
    }

}

export default FnbProcessingAreaStore;
