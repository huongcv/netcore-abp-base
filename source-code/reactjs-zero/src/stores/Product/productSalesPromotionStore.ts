import { SalesPromotionDto } from "@api/index.defs";
import { ShopSalesPromotionService } from "@api/ShopSalesPromotionService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";

class ProductSalesPromotionStore extends CommonListStore<SalesPromotionDto> {
  getNamespaceLocale(): string {
    return "promotion";
  }
  apiService(): CommonCrudApi<SalesPromotionDto> {
    return ShopSalesPromotionService as any;
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: 888,
    };
  }
  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }
}
export default ProductSalesPromotionStore;
