import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { IRequestOptions, ProductUnitViewDto } from "@api/index.defs";
import { ProductHelperService } from "@api/ProductHelperService";
import { action, makeObservable, observable } from "mobx";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { PagedResultDto } from "@ord-core/service-proxies/dto";
import {StockHelperService} from "@api/StockHelperService";

class StockSearchProductTableServerSideStore extends CommonListStore<ProductUnitViewDto> {
  constructor() {
    super();
    makeObservable(this, {
      isModalOpen: observable,
      selectedRowKeys: observable,
      selectedRows: observable,
      setSelectedRows: action,
      remove: action,
    });
  }

  isModalOpen = false;
  showModal = () => {
    this.isModalOpen = true;
    this.selectedRowKeys = [];
    this.selectedRows = [];
  };

  handleCancel() {
    this.isModalOpen = false;
    this.selectedRowKeys = [];
    this.selectedRows = [];
  }

  selectedRowKeys: string[] = [];
  selectedRows: ProductUnitViewDto[] = [];

  /// Bổ sung vào danh sách có sẵn
  setSelectedRows(products: ProductUnitViewDto[]) {
    let newItems = this.selectedRows || [];
    let itemInPage: ProductUnitViewDto[] =
      this.currentPageResult?.items || [];

    let idInPage = itemInPage.map((it) => it.productUnitId);
    newItems = newItems.filter((it) => {
      return idInPage.indexOf(it.productUnitId) < 0;
    });
    newItems = [...newItems, ...products];

    this.selectedRows = [...newItems];
    this.getSelectedRowKeys();
  }

  setNewSelectedRows(products: ProductUnitViewDto[]) {
    this.selectedRows = products;
    this.getSelectedRowKeys();
  }

  remove(id?: string) {
    this.selectedRows = this.selectedRows.filter(
      (item) => item.productUnitId !== id
    );
    this.getSelectedRowKeys();
  }

  private getSelectedRowKeys() {
    this.selectedRowKeys = this.selectedRows
      .filter((x) => !!x.productUnitId)
      .map((it) => it.productUnitId || "");
  }

  getNamespaceLocale(): string {
    return "product";
  }

  apiService() {
    return {
      getPaged: this.fetchAndTransformDataPaging,
    } as CommonCrudApi<ProductUnitViewDto>;
  }

  private async fetchAndTransformDataPaging(
    params: { body: any },
    options: IRequestOptions
  ) {
    // Gọi phương thức để lấy dữ liệu
    const response = await StockHelperService.searchWithUnit(params, options);
    // Biến đổi dữ liệu
    return {
      totalCount: response.totalCount,
      items: response.items,
    } as PagedResultDto<ProductUnitViewDto>;
  }

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: 600,
    };
  }

  getListColumnNameExcel(): string[] {
    return ["stt", "code", "name", "OrderNumber", "Type"];
  }
}

export default StockSearchProductTableServerSideStore;
