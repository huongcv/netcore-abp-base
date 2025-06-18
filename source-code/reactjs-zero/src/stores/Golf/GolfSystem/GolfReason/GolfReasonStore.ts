import { GolfReasonService } from "@api/GolfReasonService";
import { GolfReasonDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";

class GolfReasonStore extends CommonListStore<GolfReasonDto> {
  getNamespaceLocale(): string {
    return "golfReason";
  }
  apiService(): CommonCrudApi<GolfReasonDto> {
    return GolfReasonService;
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return { width: 600 };
  }
  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }
}
export default GolfReasonStore;
