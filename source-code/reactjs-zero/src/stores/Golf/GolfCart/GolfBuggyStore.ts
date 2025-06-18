import { GolfBuggyService } from "@api/GolfBuggyService";
import { GolfBuggyOutPutDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";

class GolfBuggyStore extends CommonListStore<GolfBuggyOutPutDto> {
  getNamespaceLocale(): string {
    return "GolfBuggy";
  }
  apiService() {
    return GolfBuggyService as any;
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: "1200px",
      style: {
        top: "50px",
      },
    };
  }
  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }
}

export default GolfBuggyStore;
