import { IRequestOptions, ProductPriceListDetailDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { ProductPriceListDetailService } from "@api/ProductPriceListDetailService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";

class ProductPriceListDetailStore extends CommonListStore<ProductPriceListDetailDto> {
  insertItems: ProductPriceListDetailDto[] = [];
  priceListPublishViewId: string;
  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }

  getNamespaceLocale(): string {
    return "price-list-detail";
  }

  apiService() {
    return {
      getPaged: (params: { body: any }, options: IRequestOptions) => {
        params.body.priceListPublishViewId = this.priceListPublishViewId;
        return ProductPriceListDetailService.getPaged(params);
      },
      createOrUpdate: (params, options: IRequestOptions) => {
      },
      remove: ProductPriceListDetailService.remove,
    } as CommonCrudApi<ProductPriceListDetailDto>;
  }

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: "1100px",
      style: {
        top: "10px",
      },
    };
  }

  async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
    return super.beforeSaveEntity(input, isAddNew);
  }
}

export default ProductPriceListDetailStore;
