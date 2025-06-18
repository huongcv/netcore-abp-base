import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {BarcodeProductItemDto, ProductDto} from "@api/index.defs";
import {action, makeObservable, observable} from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";
import {StockHelperService} from "@api/StockHelperService";
import {ProductBarcodeService} from "@api/ProductBarcodeService";

class ProductListPrintBarcodeStore extends CommonListStore<ProductDto> {
    selectedRowKeys: string[] = [];
    selectedRows: BarcodeProductItemDto[] = [];

    constructor() {
        super();
        makeObservable(this, {
            selectedRowKeys: observable,
            selectedRows: observable,
            setSelectedRows: action,
            remove: action,
            removeAll: action,
            loadStockMove: action
        });
    }

    getNamespaceLocale(): string {
        return "product";
    }


    apiService() {
        return ({
            getPaged: ProductBarcodeService.getPaged,
        }) as any;
    }

    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: '90vw',
            style: {
                top: '10px'
            }
        };
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    setSelectedRows(products: BarcodeProductItemDto[]) {
        let newItems = this.selectedRows || [];
        let itemInPage: BarcodeProductItemDto[] = this.currentPageResult?.items || [];
        let idInPage = itemInPage.map(it => it.id);
        newItems = newItems.filter(it => {
            return idInPage.indexOf(it.id) < 0;
        });
        newItems = [...newItems, ...products];

        this.selectedRows = [...newItems];
        this.getSelectedRowKeys();
    }

    remove(id?: string) {
        this.selectedRows = this.selectedRows.filter(item => item.id !== id);
        this.getSelectedRowKeys();
    }

    removeAll() {
        this.selectedRows = [];
        this.selectedRowKeys = [];
    }

    async loadStockMove(idHash?: string) {
        UiUtils.setBusy();
        try {
            const response = await StockHelperService.getProductBarcode({
                moveIdHash: idHash
            });
            this.selectedRowKeys = [];
            this.selectedRows = [];

            if (!response.isSuccessful) {
                UiUtils.showError(response.message);
                return;
            }

            this.setSelectedRows(response.data!);
        } catch (ex: any) {
            console.error(ex);
        } finally {
            UiUtils.clearBusy();
        }
    }

    private getSelectedRowKeys() {
        this.selectedRowKeys = this.selectedRows.filter(x => !!x.id)
            .map(it => it.id || '');
    }
}

export default ProductListPrintBarcodeStore;
