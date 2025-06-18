import { CleaningTaskService } from "@api/CleaningTaskService";
import { CleaningTaskDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { action, makeObservable, observable } from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";
import { l } from "@ord-core/language/lang.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";

class CleaningTaskTrackingStore extends CommonListStore<CleaningTaskDto> {
  constructor() {
    super();
    makeObservable(this, {
      executionDateParamsDto: observable,
      removeEntityByExecutionDate: action,
    });
  }

  executionDateParamsDto: any = null;

  apiService() {
    return CleaningTaskService;
  }
  getNamespaceLocale(): string {
    return "cleaningTask";
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: "1500px",
      style: {
        top: "10px",
      },
    };
  }
  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }
  async removeEntityByExecutionDate(dto: any) {
    UiUtils.setBusy();
    try {
      const result = await this.apiService().removeByDate(
        {
          body: dto,
        },
        {}
      );

      if (result.isSuccessful) {
        UiUtils.showSuccess(
          l.trans(
            this.getNamespaceLocale() + ".removeSuccess",
            this.executionDateParamsDto
          )
        );
        await this.refreshGridData(true);
      } else {
        ServiceProxyUtils.notifyErrorResultApi(
          result,
          this.getNamespaceLocale(),
          this.executionDateParamsDto
        );
      }
    } catch {
    } finally {
      this.closeRemoveById();
      UiUtils.clearBusy();
    }
  }
}

export default CleaningTaskTrackingStore;
