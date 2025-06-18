import { FnbTableService } from "@api/FnbTableService";
import { FnbTableDto, IRequestOptions } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class FnbTableStore extends CommonListStore<FnbTableDto> {
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
        return "fnb-table"
    }

    apiService() {
        return {
            getPaged: FnbTableService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return FnbTableService.createOrUpdate(params, options)
                }
                return FnbTableService.createOrUpdate(params, options);
            },
            remove: FnbTableService.remove
        } as CommonCrudApi<FnbTableDto>;
    }

    getInitModal(): ICreateOrUpdateModal<FnbTableDto> {
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

export default FnbTableStore;
