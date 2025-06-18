import {
    AccessCardDto,
    IRequestOptions,
    MemberInfoByCardMemberOutputDto,
    RevokeCardByAccessCardIdCommand
} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal,} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {action, makeObservable, observable} from "mobx";
import {AccessCardService} from "@api/AccessCardService";
import UiUtils from "@ord-core/utils/ui.utils";
import {l} from "@ord-core/language/lang.utils";

class GolfAccessCardStore extends CommonListStore<AccessCardDto> {
    isShowExcelModal: boolean = false;
    isShowHistoryModal: boolean = false;
    accessCardHistoryEntity: any = null

    constructor() {
        super();
        makeObservable(this, {
            isShowExcelModal: observable,
            isShowHistoryModal: observable,
            accessCardHistoryEntity: observable,
            openHistoryModal: action,
            closeHistoryModal: action,
        });
    }

    setIsShowExcelModal(isShow: boolean) {
        this.isShowExcelModal = isShow;
    }

    openHistoryModal(entity: any) {
        this.accessCardHistoryEntity = entity
        this.isShowHistoryModal = true;
    }

    closeHistoryModal() {
        this.accessCardHistoryEntity = null
        this.isShowHistoryModal = false;
    }

    getNamespaceLocale(): string {
        return "golf_access_card";
    }

    apiService() {
        return {
            exportPagedResult: AccessCardService.exportPagedResult,
            getPaged: AccessCardService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (params.body.visaNo) {
                    params.body.visaNo = "" + params.body.visaNo;
                }
                if (this.createOrUpdateModal.mode === "addNew") {
                    return AccessCardService.createOrUpdate(params, options);
                }
                return AccessCardService.createOrUpdate(params, options);
            },
            remove: AccessCardService.remove,
        } as CommonCrudApi<AccessCardDto>;
    }

    getInitModal(): ICreateOrUpdateModal<AccessCardDto> {
        return {
            entityData: {
                isActived: true,
            },
            width: "80%",
        };
    }

    getListColumnNameExcel(): string[] {
        return [
            "stt",
            "code",
            "name",
            "phone",
            "email",
            "gender",
            "debtAmount",
            "isActived",
        ];
    }

    override async beforeSaveEntity(
        input: AccessCardDto,
        isAddNew: boolean
    ): Promise<any> {
        return input;
    }

    backWard() {
        history.back();
    }

    checkAccessCardAvairable(cardCode: string) {
        return AccessCardService.getAccessCardInfoByCodeCheck({
            body: {
                cardCode: cardCode,
                checkTime: new Date(),
            }
        });
    }
    async revokeCardByAccessCardId(input: RevokeCardByAccessCardIdCommand, callback?: Function){
        try {
            const res = await AccessCardService.revokeCardByAccessCardId({
                body: input
            });
            if(res.isSuccessful){
                l.trans(this.getNamespaceLocale() + ".recallSuccess", null)
                if(callback){
                    callback();
                }
            }else{
                l.trans(this.getNamespaceLocale() + ".recallFaild", null)
            }
        }catch (error){
            UiUtils.showCatchError(error);
        }
    }
}

export default GolfAccessCardStore;
