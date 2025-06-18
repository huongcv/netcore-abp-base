import { SellReportRevenueOutputDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { SellReportService } from "@api/SellReportService";
import { makeObservable, observable } from "mobx";

class ReportSellRevenueStore extends CommonListStore<
  SellReportRevenueOutputDto,
  SellReportRevenueOutputDto
> {
  summaryData: SellReportRevenueOutputDto = {};
  constructor() {
    super();
    makeObservable(this, {
      summaryData: observable,
    });
  }
  getNamespaceLocale(): string {
    return "report_saleRevenue";
  }

  apiService() {
    return {
      getPaged: SellReportService.getPagingSellRevenueReport,
      exportPagedResult: SellReportService.exportSellRevenueReport,
    } as CommonCrudApi<SellReportRevenueOutputDto>;
  }
  loadSummary() {
    const prm = this.searchFormRef?.getFieldsValue() || {};
    SellReportService.getSaleSummary({
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
      "total",
      "fromDate",
      "toDate",
      "order",
      "invoiceDate",
      "totalAmount",
      "totalAmountBeforeDiscount",
      "totalReturnAmount",
      "taxAmount",
      "discountAmountAllocation",
      "discountAmount",
      "totalAmount",
      "paymentAmount",
      "revenueAmount",
      "debtAmount",
      "returnTotalAmount",
    ];
  }

  getInitModal(): ICreateOrUpdateModal<SellReportRevenueOutputDto> {
    return {
      width: "70%",
    };
  }

  override async beforeSaveEntity(
    input: SellReportRevenueOutputDto,
    isAddNew: boolean
  ): Promise<any> {
    return input;
  }
}

export default ReportSellRevenueStore;
