import { CashBookBusinessHouseHoldService } from "@api/CashBookBusinessHouseHoldService";
import { BusinessHouseHoldCashBookDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class BusinessHouseHoldCashBookReportStore extends CommonListStore<
  BusinessHouseHoldCashBookDto,
  BusinessHouseHoldCashBookDto
> {
  summaryData: BusinessHouseHoldCashBookDto;
  constructor() {
    super();
    makeObservable(this, {
      summaryData: observable,
    });
  }
  getNamespaceLocale(): string {
    return "cash-book";
  }

  apiService() {
    return {
      getPaged: CashBookBusinessHouseHoldService.getPaging,
      exportPagedResult: CashBookBusinessHouseHoldService.exportExcelCashbook
    }  as any;
  } 

  loadSummary() {
    const prm = this.searchFormRef?.getFieldsValue() || {};
    CashBookBusinessHouseHoldService.summary({
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

export default BusinessHouseHoldCashBookReportStore;
