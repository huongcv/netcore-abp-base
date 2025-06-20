import {DictionaryService} from "@api/DictionaryService";
import {DictionaryDto, IRequestOptions} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {CommonListStore, ICreateOrUpdateModal,} from "@ord-core/base/CommonListStore";

class DictionaryStore extends CommonListStore<DictionaryDto> {
  getNamespaceLocale(): string {
    return "dictionary";
  }
  apiService() {
    return {
      getPaged: DictionaryService.getPaged,
      createOrUpdate: (params, options: IRequestOptions) => {
        if (this.createOrUpdateModal.mode === "addNew") {
          return DictionaryService.createOrUpdate(params, options);
        }
        return DictionaryService.createOrUpdate(params, options);
      },
      remove: DictionaryService.remove,
    } as CommonCrudApi<DictionaryDto>;
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: 800,
    };
  }
  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }
}

export default DictionaryStore;
