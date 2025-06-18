import { SaleOrderDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { ImportStockService } from "@api/ImportStockService";
import { makeObservable, observable } from "mobx";
import { SaleOrderService } from "@api/SaleOrderService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";

class SaleOrderStore extends CommonListStore<SaleOrderDto> {
  productItems: any[] = [];
  productDetail: any = {};

  constructor() {
    super();
    makeObservable(this, {
      productItems: observable,
      productDetail: observable,
    });
  }

  getNamespaceLocale(): string {
    return "sale-order";
  }

  apiService() {
    return {
      getPaged: SaleOrderService.getPaged,
    //   createOrUpdate: (params, options: IRequestOptions) => {
    //     if (params.body.visaNo) {
    //       params.body.visaNo = "" + params.body.visaNo;
    //     }
    //     if (this.createOrUpdateModal.mode === "addNew") {
    //       return GolfBookingGroupService.createOrUpdate(params, options);
    //     }
    //     return GolfBookingGroupService.createOrUpdate(params, options);
    //   },
    //   remove: GolfBookingGroupService.remove,
    } as CommonCrudApi<SaleOrderDto>;
  }

  

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: 600,
    };
  }

  getListColumnNameExcel(): string[] {
    return [];
  }
}

export default SaleOrderStore;
