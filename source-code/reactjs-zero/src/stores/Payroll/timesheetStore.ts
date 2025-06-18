import {
  DailySummaryProductReportOutputDto,
  EmployeeTimesheetDto,
} from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { makeObservable, observable } from "mobx";
import { DailySummaryProductReportService } from "@api/DailySummaryProductReportService";
import { EmployeeTimesheetService } from "@api/EmployeeTimesheetService";

class TimesheetStore extends CommonListStore<
  EmployeeTimesheetDto,
  EmployeeTimesheetDto
> {
  timeSheetEditModel: ICreateOrUpdateModal<any> = {
    ...this.getInitModal(),
  };

  constructor() {
    super();
    makeObservable(this, {
      timeSheetEditModel: observable,
    });
  }

  setOpenTimesheetEditModal(entityData?: any) {
    this.timeSheetEditModel.width = 1200;
    this.timeSheetEditModel.visible = true;
    this.timeSheetEditModel.entityData = entityData;
  }

  closeTimesheetEditModal(mustRefreshGridData: boolean = false) {
    this.timeSheetEditModel.visible = false;
    this.timeSheetEditModel.entityData = null;
    if (mustRefreshGridData) {
      this.refreshGridData().then();
    }
  }

  getNamespaceLocale(): string {
    return "timesheet";
  }

  apiService() {
    return {
      getPaged: EmployeeTimesheetService.getPaged,
      // exportPagedResult: EmployeeTimesheetService.exportPagedResult,
      createOrUpdate: EmployeeTimesheetService.createOrUpdate,
      remove: EmployeeTimesheetService.remove,
    } as CommonCrudApi<EmployeeTimesheetDto>;
  }

  getListColumnNameExcel(): string[] {
    return [];
  }

  protected getOtherFields(): string[] {
    return [
      "total",
      "reportDate",
      "order",
      "productCode",
      "productName",
      "basicUnitName",
      "qtyConvert",
      "paymentAmount",
      "taxAmount",
      "discountAmount",
      "returnQtyConvert",
      "returnTotalAmount",
      "revenueAmount",
    ];
  }

  getInitModal(): ICreateOrUpdateModal<EmployeeTimesheetDto> {
    return {
      width: "30%",
    };
  }
  getCountApi() {
    return EmployeeTimesheetService.getCount({
      body: {
        ...this.searchFormRef?.getFieldsValue(),
      },
    });
  }
}

export default TimesheetStore;
