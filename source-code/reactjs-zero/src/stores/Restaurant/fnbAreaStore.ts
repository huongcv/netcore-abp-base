import { FnbAreaService } from "@api/FnbAreaService";
import { FnbAreaDto, IRequestOptions } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class FnbAreaStore extends CommonListStore<FnbAreaDto> {
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
        return "fnb-area"
    }

    apiService() {
        return {
            getPaged: FnbAreaService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return FnbAreaService.createOrUpdate(params, options)
                }
                return FnbAreaService.createOrUpdate(params, options);
            },
            remove: FnbAreaService.remove
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

export default FnbAreaStore;
