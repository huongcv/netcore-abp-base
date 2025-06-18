import { DiscountService } from "@api/DiscountService";
import { ShopDiscountDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import SelectDataSourceStore from "@ord-store/selectDataSourceStore";
import { makeObservable, observable } from "mobx";

class ProductDiscountStore extends CommonListStore<ShopDiscountDto> {
  discountListItem: ShopDiscountDto;
  selectDataSourceStore: SelectDataSourceStore;
  isShowExcelModal: boolean = false;

  constructor() {
    super();
    makeObservable(this, {
      isShowExcelModal: observable,
    });
  }

  setIsShowExcelModal(isShow: boolean) {
    this.isShowExcelModal = isShow;
  }

  getNamespaceLocale(): string {
    return "discount";
  }
  apiService() {
    return DiscountService;
  }
  getInitModal(): ICreateOrUpdateModal<ShopDiscountDto> {
    return {
      width: "800px",
      style: {
        top: "10px",
      },
    };
  }
  getListColumnNameExcel(): string[] {
    return [
      "stt",
      "code",
      "discountType",
      "discountUseType",
      "startDate",
      "endDate",
      "discountValue",
      "usageLimit",
      "usageCount",
      "discountStatus",
    ];
  }
}

export default ProductDiscountStore;
