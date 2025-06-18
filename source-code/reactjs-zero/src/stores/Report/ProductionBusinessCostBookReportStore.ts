
import { ProductionBusinessCostSummaryDto } from "@api/index.defs";
import { ProductionBusinessCostBookService } from "@api/ProductionBusinessCostBookService";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class ProductionBusinessCostBookReportStore extends CommonListStore<
  any
> {
  summaryData: ProductionBusinessCostSummaryDto[];
  constructor() {
    super();
    makeObservable(this, {
      summaryData: observable,
    });
  }
  getNamespaceLocale(): string {
    return "production-business";
  }

  apiService() {
    return {
      getPaged: ProductionBusinessCostBookService.getPaging,
      exportPagedResult: ProductionBusinessCostBookService.exportExcelProductionBusiness,
    } as any;
  }

  loadSummary() {
    const prm = this.searchFormRef?.getFieldsValue() || {};
    ProductionBusinessCostBookService.summary({
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

export default ProductionBusinessCostBookReportStore;
