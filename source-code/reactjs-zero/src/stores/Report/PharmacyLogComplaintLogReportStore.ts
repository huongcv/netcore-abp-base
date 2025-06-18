import { IRequestOptions, PharmacyComplaintLogDto } from "@api/index.defs";
import { PharmacyComplaintLogService } from "@api/PharmacyComplaintLogService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable } from "mobx";

class PharmacyLogComplaintLogReportStore extends CommonListStore<PharmacyComplaintLogDto> {
  constructor() {
    super();
    makeObservable(this, {});
  }

  getNamespaceLocale(): string {
    return "report_pharmacyLogComplaintLog";
  }
  apiService(): CommonCrudApi<PharmacyComplaintLogDto> {
    return {
      getPaged: PharmacyComplaintLogService.getPaged,
      createOrUpdate: (params, options: IRequestOptions) => {
        if (this.createOrUpdateModal.mode === "addNew") {
          return PharmacyComplaintLogService.createOrUpdate(params, options);
        }
        return PharmacyComplaintLogService.createOrUpdate(params, options);
      },
      remove: PharmacyComplaintLogService.remove,
      exportPagedResult: PharmacyComplaintLogService.exportDataToExcel,
    } as CommonCrudApi<PharmacyComplaintLogDto>;
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
      "email",
      "phoneNumber",
      "address",
      "informationRecipient",
      "patientInfo",
      "productRecalledName",
      "productRecalledCode",
      "lotNumber",
      "qty",
      "basicUnitName",
      "complaintContent",
      "processingDirection",
      "notes",
    ];
  }
  getListColumnNameExcel(): string[] {
    return [];
  }
}
export default PharmacyLogComplaintLogReportStore;
