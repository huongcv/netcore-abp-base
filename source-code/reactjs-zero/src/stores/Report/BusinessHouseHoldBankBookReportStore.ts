import { BankBookBusinessHouseHoldService } from "@api/BankBookBusinessHouseHoldService";
import { BusinessHouseHoldBankBookDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class BusinessHouseHoldBankBookReportStore extends CommonListStore<
  BusinessHouseHoldBankBookDto
> {
  summaryData: BusinessHouseHoldBankBookDto;
  constructor() {
    super();
    makeObservable(this, {
      summaryData: observable,
    });
  }
  getNamespaceLocale(): string {
    return "bank-book";
  }

  apiService() {
    return {
      getPaged: BankBookBusinessHouseHoldService.getPaging,
      exportPagedResult: BankBookBusinessHouseHoldService.exportExcelBankbook,
    }  as any;
  } 

  loadSummary() {
    const prm = this.searchFormRef?.getFieldsValue() || {};
    BankBookBusinessHouseHoldService.summary({
      body: prm,
    }).then((res) => {
      this.summaryData = res;
    });
  }

  getListColumnNameExcel(): string[] {
    return [];
  }

  protected getOtherFields(): string[] {
    return [

    ];
  }

  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: "70%",
    };
  }

}

export default BusinessHouseHoldBankBookReportStore;
