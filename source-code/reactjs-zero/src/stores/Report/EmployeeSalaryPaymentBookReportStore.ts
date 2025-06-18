import { EmployeeSalaryPaymentBookService } from "@api/EmployeeSalaryPaymentBookService";
import { EmployeeSalaryPaymentBookSummaryDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class EmployeeSalaryPaymentBookReportStore extends CommonListStore<
  EmployeeSalaryPaymentBookSummaryDto
> {
  summaryData: EmployeeSalaryPaymentBookSummaryDto;
  constructor() {
    super();
    makeObservable(this, {
      summaryData: observable,
    });
  }
  getNamespaceLocale(): string {
    return "employee-salary-payment-book";
  }

  apiService() {
    return {
      getPaged: EmployeeSalaryPaymentBookService.getPaging,
      exportPagedResult: EmployeeSalaryPaymentBookService.exportExcelSalary,
    }  as any;
  } 

  loadSummary() {
    const prm = this.searchFormRef?.getFieldsValue() || {};
    EmployeeSalaryPaymentBookService.summary({
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

export default EmployeeSalaryPaymentBookReportStore;
