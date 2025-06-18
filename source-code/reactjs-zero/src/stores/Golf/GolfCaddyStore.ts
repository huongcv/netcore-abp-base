import { GolfCaddyService } from "@api/GolfCaddyService";
import { PartnerDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";

class GolfCaddyStore extends CommonListStore<PartnerDto> {
  getNamespaceLocale(): string {
    return "GolfCaddy";
  }
  apiService() {
    return GolfCaddyService as any;
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
    return ["code", "name", "dateOfBirth", "phone"];
  }
}

export default GolfCaddyStore;
