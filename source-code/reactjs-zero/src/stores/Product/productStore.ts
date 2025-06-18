import { number, ProductDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { ProductService } from "@api/ProductService";
import { ProductServiceCustom } from "@api/ProductServiceCustom";
import UiUtils from "@ord-core/utils/ui.utils";
import { l } from "@ord-core/language/lang.utils";
import { action, makeObservable, observable } from "mobx";

class ProductListStore extends CommonListStore<ProductDto> {
  idsProductAfterPaymentSuccess?: string[] = [];
  constructor() {
    super();
    makeObservable(this, {
      idsProductAfterPaymentSuccess: observable,
      setIdsProductAfterPaymentSuccess: action,
    });
  }

  // cập nhật 
  setIdsProductAfterPaymentSuccess(ids: string[]) {
    this.idsProductAfterPaymentSuccess = ids;
  }

  getNamespaceLocale(): string {
    return "product";
  }

  apiService() {
    return {
      getPaged: ProductService.getPaged,
      exportPagedResult: ProductService.exportPagedResult,
      remove: ProductServiceCustom.remove,
      createOrUpdate: ProductServiceCustom.createOrUpdate,
    };
  }

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: "90%",
      style: {
        top: "10px",
      },
    };
  }

  getListColumnNameExcel(): string[] {
    return [
      "stt",
      "type",
      "code",
      "name",
      "qtyInventory",
      "basicUnitNameShort",
      "ProductPrice",
      "costPrice",
      "isActived",
    ];
  }

  protected getOtherFields(): string[] {
    return [
      "ProductType.HangHoa",
      "ProductType.DichVu",
      "ProductType.GoiDichVuLieuTrinh",
      "ProductType.DuocPham",
      "ProductType.VatTuYTe",
      "ProductType.Khac",
    ];
  }

  async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
    if (isAddNew) {
      if (!!input.productImg) {
        try {
          const uploadDto = await ProductService.uploadProductImg({
            files: [input.productImg] as any,
          });
          if (uploadDto.length > 0) {
            input.ImageUrl = uploadDto[0].fileId + "";
          }
        } catch { }
      }
    }
    else {
      // CẬP NHẬT
      if (input.productImg instanceof File) {
        // Nếu người dùng chọn ảnh mới
        try {
          const uploadDto = await ProductService.uploadProductImg({
            files: [input.productImg] as any,
          });
          if (uploadDto.length > 0) {
            input.ImageUrl = uploadDto[0].fileId + "";
          }
        } catch (error) { }
      } else if (input.productImg === null || input.productImg === '') {
        // Người dùng chọn xoá ảnh
        input.ImageUrl = null;
      }
      // Trường hợp giữ nguyên ảnh thì không làm gì cả
    }
    if (input?.inventoryQtyMax && input?.inventoryQtyMin) {
      if (input?.inventoryQtyMax < input?.inventoryQtyMin) {
        UiUtils.showError(
          l.transCommon("inventoryQtyMaxNotSmallerInventoryQtyMin")
        );
        return;
      }
    }
    return super.beforeSaveEntity(input, isAddNew);
  }
  getCountApi() {
    return ProductService.getCount({
      body: {
        ...this.searchFormRef?.getFieldsValue(),
      },
    })
  }
}

export default ProductListStore;
