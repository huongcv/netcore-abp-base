import { ProductPriceListDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { ProductPriceListService } from "@api/ProductPriceListService";
import SelectDataSourceStore from "@ord-store/selectDataSourceStore";
import { makeObservable, observable } from "mobx";

class ProductPriceListStore extends CommonListStore<ProductPriceListDto> {
  priceListItem: ProductPriceListDto;
  selectDataSourceStore: SelectDataSourceStore;
  isOpenViaDetail?: boolean;

  constructor() {
    super();
    makeObservable(this, {
      isOpenViaDetail: observable
    })
  }

  getNamespaceLocale(): string {
    return "price-list";
  }

  apiService() {
    return ProductPriceListService;
  }

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: "800px",
      style: {
        top: "10px",
      },
    };
  }

  getListColumnNameExcel(): string[] {
    return ["stt", "code", "name"];
  }

  async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
    return super.beforeSaveEntity(input, isAddNew);
  }

  afterSaveSuccessEntity() {
    if (this.selectDataSourceStore) {
      this.selectDataSourceStore.clearByName("ProductPriceList");
      super.afterSaveSuccessEntity();
    }

  }

  closeRemoveById() {
    if (this.selectDataSourceStore) {
      this.selectDataSourceStore.clearByName("ProductPriceList");
      super.closeRemoveById();
    }
  }
}

export default ProductPriceListStore;
