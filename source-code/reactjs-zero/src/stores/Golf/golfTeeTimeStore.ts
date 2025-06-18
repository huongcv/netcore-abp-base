import {FlightSlot, GolfFlightOutputDto, GolfTeeTimeConfigDto} from "@api/index.defs";
import { TeeTimeConfigService } from "@api/TeeTimeConfigService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";

import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";

class GolfTeeTimeStore extends CommonListStore<GolfTeeTimeConfigDto> {
  getNamespaceLocale(): string {
    return "golf-teeTime";
  }

  apiService() {
    return {
      getPaged: TeeTimeConfigService.getPaged,
      remove: TeeTimeConfigService.remove,
      createOrUpdate: TeeTimeConfigService.createOrUpdate,
    };
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: 1200,
    };
  }
  async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
    // if (true) {
    //     return;
    // }
    return super.beforeSaveEntity(input, isAddNew);
  }

  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }
}
export default GolfTeeTimeStore;
