import { GolfBuggyGroupService } from "@api/GolfBuggyGroupService";
import { GolfBuggyGroupDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class GolfBuggyGroupStore extends CommonListStore<GolfBuggyGroupDto> {
  isShowBuggyGroupListModal: boolean = false;
  constructor() {
    super();
    makeObservable(this, {
      isShowBuggyGroupListModal: observable,
    });
  }

  setIsShowBuggyGroupListModal(isShow: boolean) {
    this.isShowBuggyGroupListModal = isShow;
  }
  getNamespaceLocale(): string {
    return "buggy-group";
  }

  apiService() {
    return GolfBuggyGroupService;
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

export default GolfBuggyGroupStore;
