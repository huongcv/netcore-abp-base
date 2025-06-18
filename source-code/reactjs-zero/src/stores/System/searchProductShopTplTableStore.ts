import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ProductGroupDto, ProductSearchWithUnitDto, ShopTemplateDetailsDto} from "@api/index.defs";
import {ProductHelperService} from "@api/ProductHelperService";
import {action, makeObservable, observable} from "mobx";


class SearchProductShopTplTableStore extends CommonListStore<ProductGroupDto> {
    constructor() {
        super();
        makeObservable(this, {
            isModalOpen: observable,
            selectedRowKeys: observable,
            selectedRows: observable,
            setSelectedRows: action,
            remove: action
        })
    }

    isModalOpen = false;
    onlyGetProductUsingInventory = false;
    showModal = () => {
        this.isModalOpen = true;
        this.selectedRowKeys = [];
        this.selectedRows = [];
    };

    setGetProductUsingInventory(onlyGetProductUsingInventory: boolean) {
        this.onlyGetProductUsingInventory = onlyGetProductUsingInventory;
    }

    handleCancel() {
        this.isModalOpen = false;
        this.selectedRowKeys = [];
        this.selectedRows = [];
    }

    selectedRowKeys: string[] = [];
    selectedRows: ShopTemplateDetailsDto[] = [];

    insertSelectedRow(product: ShopTemplateDetailsDto) {
        this.selectedRows = [
            ...this.selectedRows,
            product
        ];
        this.getSelectedRowKeys();
    }

    setSelectedRows(products: ShopTemplateDetailsDto[]) {
        let newItems = this.selectedRows || [];
        let itemInPage: ProductSearchWithUnitDto[] = this.currentPageResult?.items || [];
        let idInPage = itemInPage.map(it => it.productUnitId);
        newItems = newItems.filter(it => {
            return idInPage.indexOf(it.productUnitId) < 0;
        });
        newItems = [...newItems, ...products];

        this.selectedRows = [...newItems];
        this.getSelectedRowKeys();
        // this.selectedRows = [...products];
        // this.getSelectedRowKeys();
    }
    private getSelectedRowKeys() {
        this.selectedRowKeys = this.selectedRows.filter(x => !!x.productUnitId)
            .map(it => it.productUnitId || '');
    }

    remove(id?: string) {
        this.selectedRows = this.selectedRows.filter(item => item.productUnitId !== id);
        this.getSelectedRowKeys();
    }



    getNamespaceLocale(): string {
        return "product"
    }

    apiService() {
        return {
            getPaged: (param: any) => {
                param.body.onlyGetProductUsingInventory = this.onlyGetProductUsingInventory;
                return ProductHelperService.searchWithUnit(param)
            }
        } as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }
}

export default SearchProductShopTplTableStore;
