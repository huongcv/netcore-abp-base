import { AccessCardDto, GolfAccessCardColorDto, IRequestOptions } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { makeObservable, observable } from "mobx";
import { AccessCardService } from "@api/AccessCardService";
import { GolfAccessCardColorService } from "@api/GolfAccessCardColorService";


class GolfAccessCardColorStore extends CommonListStore<GolfAccessCardColorDto> {
  isShowExcelModal: boolean = false;

  constructor() {
    super();
    makeObservable(this, {
      isShowExcelModal: observable,
    });
  }

  setIsShowExcelModal(isShow: boolean) {
    this.isShowExcelModal = isShow;
  }

  getNamespaceLocale(): string {
    return "golf-access-card-color";
  }

  apiService() {
    return {
      // exportPagedResult: AccessCardService.exportPagedResult,
      getPaged: GolfAccessCardColorService.getPaged,
      createOrUpdate: (params, options: IRequestOptions) => {
        if (params.body.visaNo) {
          params.body.visaNo = "" + params.body.visaNo;
        }
        if (this.createOrUpdateModal.mode === "addNew") {
          return GolfAccessCardColorService.createOrUpdate(params, options);
        }
        return GolfAccessCardColorService.createOrUpdate(params, options);
      },
      remove: GolfAccessCardColorService.remove,
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
}

export default GolfAccessCardColorStore;
