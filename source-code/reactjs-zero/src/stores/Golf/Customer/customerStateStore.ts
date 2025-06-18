import { CountryStateDto, PartnerDto, IRequestOptions } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CustomerService } from "@api/CustomerService";
import { makeObservable, observable } from "mobx";
import { GolfCustomerService } from "@api/GolfCustomerService";

export interface IChangeCustomerDebt {
  partnerId?: string | undefined;
  partnerCode: string | undefined;
  partnerName: string | undefined;

  transactionId?: string | undefined;
  transactionDate: Date;
  currentDebtAmount: number | undefined;
  amount: number | undefined; ///DebtAmount
}

class CustomerStore extends CommonListStore<PartnerDto> {
  isShowExcelModal: boolean = false;

  updateMemberShipCardModel: ICreateOrUpdateModal<any> = {
    ...this.getInitModal(),
  };

  accessCardManageModel: ICreateOrUpdateModal<any> = {
    ...this.getInitModal(),
  };

  constructor() {
    super();
    makeObservable(this, {
      isShowExcelModal: observable,
      updateMemberShipCardModel: observable,
      accessCardManageModel: observable,
    });
  }

  setOpenAccessCardManageModal(entityData?: any) {
    this.accessCardManageModel.width = 1000;
    this.accessCardManageModel.visible = true;
    this.accessCardManageModel.entityData = entityData;
  }

  closeAccessCardManageModal(mustRefreshGridData: boolean = false) {
    this.accessCardManageModel.visible = false;
    this.accessCardManageModel.entityData = null;
    if (mustRefreshGridData) {
      this.refreshGridData().then();
    }
  }

  setOpenAddMemberShipCardModal(entityData?: any) {
    this.updateMemberShipCardModel.width = 800;
    this.updateMemberShipCardModel.visible = true;
    this.updateMemberShipCardModel.entityData = entityData;
    this.updateMemberShipCardModel.mode = "addNew";
  }

  setOpenViewMemberShipCardModal(entityData?: any) {
    this.updateMemberShipCardModel.width = 800;
    this.updateMemberShipCardModel.visible = true;
    this.updateMemberShipCardModel.entityData = entityData;
    this.updateMemberShipCardModel.mode = "viewDetail";
  }

  setOpenUpdateMemberShipCardModal(entityData?: any) {
    this.updateMemberShipCardModel.width = 800;
    this.updateMemberShipCardModel.visible = true;
    this.updateMemberShipCardModel.entityData = entityData;
    this.updateMemberShipCardModel.mode = "update";
  }

  closeCrudMemberShipCardModal(mustRefreshGridData: boolean = false) {
    this.updateMemberShipCardModel.visible = false;
    this.updateMemberShipCardModel.entityData = null;
    if (mustRefreshGridData) {
      this.refreshGridData().then();
    }
  }

  setIsShowExcelModal(isShow: boolean) {
    this.isShowExcelModal = isShow;
  }

  getNamespaceLocale(): string {
    return "golf-customer";
  }

  apiService() {
    return {
      exportPagedResult: CustomerService.exportPagedResult,
      getPaged: GolfCustomerService.getPagedGolfPartner,
      createOrUpdate: (params, options: IRequestOptions) => {
        if (params.body.visaNo) {
          params.body.visaNo = "" + params.body.visaNo;
        }
        if (this.createOrUpdateModal.mode === "addNew") {
          return GolfCustomerService.createOrUpdateGolfPartner(params, options);
        }
        return GolfCustomerService.createOrUpdateGolfPartner(params, options);
      },
      remove: CustomerService.remove,
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
    input: CountryStateDto,
    isAddNew: boolean
  ): Promise<any> {
    return input;
  }

  backWard() {
    history.back();
  }
}

export default CustomerStore;
