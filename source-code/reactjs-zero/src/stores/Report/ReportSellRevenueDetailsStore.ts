import {
  SellReportRevenueDetailOutputDto,
  SellReportRevenueOutputDto,
} from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { SellReportService } from "@api/SellReportService";
import { makeObservable, observable } from "mobx";

class ReportSellRevenueDetailsStore extends CommonListStore<
  SellReportRevenueDetailOutputDto,
  SellReportRevenueDetailOutputDto
> {
  summaryData: SellReportRevenueOutputDto = {};

  constructor() {
    super();
    makeObservable(this, {
      summaryData: observable,
    });
  }

  getNamespaceLocale(): string {
    return "report_saleRevenueDetails";
  }

  apiService() {
    return {
      getPaged: SellReportService.getPagingSellRevenueReportDetail,
      exportPagedResult: SellReportService.exportSellRevenueReportDetail,
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
      "invoiceCode",
      "productName",
      "partnerName",
      "totalPrice",
      "totalAmount",
      "totalRefund",
      "taxAmount",
      "discount",
      "discountAmount",
      "paymentAmount",
      "revenueAmount",
      "debtAmount",
      "totalAmountBeforeDiscount",
      "returnTotalAmount",
      "discountAmountAllocation",
    ];
  }

  getInitModal(): ICreateOrUpdateModal<SellReportRevenueDetailOutputDto> {
    return {
      width: "70%",
    };
  }

  override async beforeSaveEntity(
    input: SellReportRevenueDetailOutputDto,
    isAddNew: boolean
  ): Promise<any> {
    return input;
  }
}

export default ReportSellRevenueDetailsStore;
