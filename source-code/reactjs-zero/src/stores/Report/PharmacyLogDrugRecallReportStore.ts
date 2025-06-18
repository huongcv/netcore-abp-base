import { DrugRecallService } from "@api/DrugRecallService";
import { DrugRecallDto, IRequestOptions } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable } from "mobx";

class PharmacyLogDrugRecallReportStore extends CommonListStore<DrugRecallDto> {
  constructor() {
    super();
    makeObservable(this, {});
  }
  getNamespaceLocale(): string {
    return "drugrecall";
  }
  apiService(): CommonCrudApi<DrugRecallDto> {
    return {
      getPaged: DrugRecallService.getPaged,
      createOrUpdate: (params, options: IRequestOptions) => {
        if (this.createOrUpdateModal.mode === "addNew") {
          return DrugRecallService.createOrUpdate(params, options);
        }
        return DrugRecallService.createOrUpdate(params, options);
      },
      remove: DrugRecallService.remove,
      exportPagedResult: DrugRecallService.exportDataToExcel,
    } as CommonCrudApi<DrugRecallDto>;
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: "70%",
    };
  }
  protected getOtherFields(): string[] {
    return [
      "order",
      "fromDate",
      "toDate",
      "createdTime",
      "placeRequestRecall",
      "productName",
      "productCode",
      "placeRecovery",
      //"productId",
      "soldQty",
      "soldUnitName",
      "recalledQty",
      "recalledUnitName",
      "partnerName",
      "reasonRecall",
      "expectedTreatment",
      "notes",
      //"isActived",
    ];
  }
  getListColumnNameExcel(): string[] {
    return [];
  }
}
export default PharmacyLogDrugRecallReportStore;
