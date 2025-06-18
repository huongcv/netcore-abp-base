import { DiscountService } from "@api/DiscountService";
import { ShopDiscountDto } from "@api/index.defs";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { action, makeObservable, observable } from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";

class DiscountListPrintBarcodeStore extends CommonListStore<ShopDiscountDto> {
  selectedRowKeys: string[] = [];
  selectedRows: ShopDiscountDto[] = [];
  constructor() {
    super();
    makeObservable(this, {
      selectedRowKeys: observable,
      selectedRows: observable,
      setSelectedRows: action,
      remove: action,
      loadStockMove: action,
    });
  }
  getNamespaceLocale(): string {
    return "discount";
  }

  apiService() {
    return DiscountService;
  }

  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: "90vw",
      style: {
        top: "10px",
      },
    };
  }

  getListColumnNameExcel(): string[] {
    return [];
  }

  setSelectedRows(discounts: ShopDiscountDto[]) {
    let newItems = this.selectedRows || [];
    let itemInPage: ShopDiscountDto[] = this.currentPageResult?.items || [];
    let idInPage = itemInPage.map((it) => it.id);
    newItems = newItems.filter((it) => {
      return idInPage.indexOf(it.id) < 0;
    });
    newItems = [...newItems, ...discounts];

    this.selectedRows = [...newItems];
    this.getSelectedRowKeys();
  }

  remove(id?: string) {
    this.selectedRows = this.selectedRows.filter((item) => item.id !== id);
    this.getSelectedRowKeys();
  }

  async loadStockMove(idHash?: string) {
    UiUtils.setBusy();
    try {
      this.selectedRowKeys = [];
      this.selectedRows = [];
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
  }

  private getSelectedRowKeys() {
    this.selectedRowKeys = this.selectedRows
      .filter((x) => !!x.id)
      .map((it) => it.id || "");
  }
}

export default DiscountListPrintBarcodeStore;
