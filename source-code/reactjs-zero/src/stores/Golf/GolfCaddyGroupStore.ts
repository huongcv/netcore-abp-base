import { GolfCaddyGroupService } from "@api/GolfCaddyGroupService";
import { IRequestOptions, PartnerDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";

class CaddyGroupStore extends CommonListStore<PartnerDto> {
  getNamespaceLocale(): string {
    return "caddy-group";
  }

  apiService() {
    return GolfCaddyGroupService;
  }

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: 600,
    };
  }

  getListColumnNameExcel(): string[] {
    return ["stt", "GroupCode", "GroupName", "GroupType", "Notes", "Status"];
  }
}

export default CaddyGroupStore;
