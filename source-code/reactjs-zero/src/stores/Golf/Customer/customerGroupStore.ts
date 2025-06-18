import { CountryStateDto, PartnerDto, IRequestOptions } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { makeObservable, observable } from "mobx";
import { GolfBookingGroupService } from "@api/GolfBookingGroupService";

class CustomerGroupStore extends CommonListStore<PartnerDto> {
  isShowExcelModal: boolean = false;

  createOrUpdateMemberModal: ICreateOrUpdateModal<any> = {
    ...this.getInitModal(),
  };

  constructor() {
    super();
    makeObservable(this, {
      isShowExcelModal: observable,
      createOrUpdateMemberModal: observable,
    });
  }

  setOpenCrudMemberModal(entityData?: any) {
    this.createOrUpdateMemberModal.width = 800;
    this.createOrUpdateMemberModal.visible = true;
    this.createOrUpdateMemberModal.entityData = entityData;
    this.createOrUpdateMemberModal.mode = "addNew";
  }

  setOpenUpdateMemberModal(entityData?: any) {
    this.createOrUpdateMemberModal.width = 800;
    this.createOrUpdateMemberModal.visible = true;
    this.createOrUpdateMemberModal.entityData = entityData;
    this.createOrUpdateMemberModal.mode = "update";
  }

   setOpenViewMemberModal(entityData?: any) {
    this.createOrUpdateMemberModal.width = 800;
    this.createOrUpdateMemberModal.visible = true;
    this.createOrUpdateMemberModal.entityData = entityData;
    this.createOrUpdateMemberModal.mode = "viewDetail";
  }

  closeCrudMemberModal(mustRefreshGridData: boolean = false) {
    this.createOrUpdateMemberModal.visible = false;
    this.createOrUpdateMemberModal.entityData = null;
    if (mustRefreshGridData) {
      this.refreshGridData().then();
    }
  }

  setIsShowExcelModal(isShow: boolean) {
    this.isShowExcelModal = isShow;
  }

  getNamespaceLocale(): string {
    return "golf-customer-group";
  }

  apiService() {
    return {
      exportPagedResult: GolfBookingGroupService.exportPagedResult,
      getPaged: GolfBookingGroupService.getPaged,
      createOrUpdate: (params, options: IRequestOptions) => {
        if (params.body.visaNo) {
          params.body.visaNo = "" + params.body.visaNo;
        }
        if (this.createOrUpdateModal.mode === "addNew") {
          return GolfBookingGroupService.createOrUpdate(params, options);
        }
        return GolfBookingGroupService.createOrUpdate(params, options);
      },
      remove: GolfBookingGroupService.remove,
    } as CommonCrudApi<PartnerDto>;
  }

  getInitModal(): ICreateOrUpdateModal<PartnerDto> {
    return {
      entityData: {
        isActived: true,
        categoryId: 1,
        type: 1,
        gender: 1,
      },
      width: "80%",
    };
  }

  getListColumnNameExcel(): string[] {
    return [
      "stt",
      "groupNo",
      "groupName",
      "notes",
      "status",
    ];
  }

  override async beforeSaveEntity(
    input: CountryStateDto,
    isAddNew: boolean
  ): Promise<any> {
    return input;
  }

  backWard() {
    history.back();
  }
}

export default CustomerGroupStore;
