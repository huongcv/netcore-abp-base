import { StockReportCommodityPlanOutputDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { makeObservable } from "mobx";
import { StockReportService } from "@api/StockReportService";

class ReportStockCommodityPlanStore extends CommonListStore<StockReportCommodityPlanOutputDto> {
  constructor() {
    super();
    makeObservable(this, {});
  }

  getNamespaceLocale(): string {
    return "report_stockCommodityPlan";
  }
  apiService() {
    return {
      getPaged: StockReportService.getPaging2,
      exportPagedResult: StockReportService.exportReport2,
    } as CommonCrudApi<StockReportCommodityPlanOutputDto>;
  }

  getListColumnNameExcel(): string[] {
    return [];
  }

  protected getOtherFields(): string[] {
    return [
      "order",
      "inventoryId",
      "productCode",
      "productName",
      "basicUnitName",
      "inventoryQtyMax",
      "inventoryQty",
      "forecast",
    ];
  }

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: "70%",
    };
  }
}

export default ReportStockCommodityPlanStore;
