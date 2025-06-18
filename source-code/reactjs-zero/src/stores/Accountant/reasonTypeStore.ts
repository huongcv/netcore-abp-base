import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ACCOUNT_MOVE_TYPE, MoveReasonTypeDto} from "@api/index.defs";
import {makeObservable, observable} from "mobx";
import { AccountMoveReasonTypeService } from "@api/AccountMoveReasonTypeService";

class ReasonTypeStore extends CommonListStore<MoveReasonTypeDto, MoveReasonTypeDto> {
    isShowListModal: boolean = false;

    constructor() {
        super();
        makeObservable(this, {
            isShowListModal: observable
        })

    }

    getNamespaceLocale(): string {
        return 'reason-type'
    }

    openCreateModalWithType(reasonType: ACCOUNT_MOVE_TYPE) {
        this.isAddNewEntity = true;
        this.entityUpdateData = null
        this.createOrUpdateModal.visible = true;
        this.createOrUpdateModal.entityData = {
            reasonMoveType: reasonType,
            isActived: true
        };
        this.createOrUpdateModal.mode = 'addNew';
    }

    setIsShowListModal(isShow: boolean) {
        this.isShowListModal = isShow;
    }

    apiService() {
        return AccountMoveReasonTypeService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600,
            entityData: {
                isActived: true
            }
        };
    }


    getListColumnNameExcel(): string[] {
        return ['stt', 'ReasonTypeName', 'ReasonMoveType', 'PartnerType', 'Status']
    }
}

export default ReasonTypeStore;
