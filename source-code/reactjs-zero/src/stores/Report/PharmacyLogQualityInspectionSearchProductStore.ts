import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    ProductFromInventoryWithUnitDto,
    ProductGroupDto,
    ProductSearchWithUnitDto,
    ShopTemplateDetailsDto
} from "@api/index.defs";
import {ProductHelperService} from "@api/ProductHelperService";
import {action, makeObservable, observable} from "mobx";


class PharmacyLogQualityInspectionSearchProductStore extends CommonListStore<ProductGroupDto> {
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
    selectedRows: ProductFromInventoryWithUnitDto[] = [];

    insertSelectedRow(product: ShopTemplateDetailsDto) {
        this.selectedRows = [
            ...this.selectedRows,
            product
        ];
        this.getSelectedRowKeys();
    }

    setSelectedRows(products: ProductFromInventoryWithUnitDto[]) {
        let newItems = this.selectedRows || [];
        let itemInPage: ProductFromInventoryWithUnitDto[] = this.currentPageResult?.items || [];
        let idInPage = itemInPage.map(it => it.rowkey);
        newItems = newItems.filter(it => {
            return idInPage.indexOf(it.rowkey) < 0;
        });
        newItems = [...newItems, ...products];

        this.selectedRows = [...newItems];
        this.getSelectedRowKeys();
        // this.selectedRows = [...products];
        // this.getSelectedRowKeys();
    }
    private getSelectedRowKeys() {
        this.selectedRowKeys = this.selectedRows.filter(x => !!x.rowkey)
            .map(it => it.rowkey || '');
    }

    remove(id?: string) {
        this.selectedRows = this.selectedRows.filter(item => item.rowkey !== id);
        this.getSelectedRowKeys();
    }



    getNamespaceLocale(): string {
        return "product"
    }

    apiService() {
        return {
            getPaged: (param: any) => {
                // param.body.onlyGetProductUsingInventory = this.onlyGetProductUsingInventory;
                return ProductHelperService.getPagingProductInfoFromInventoryAvailable(param)
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

export default PharmacyLogQualityInspectionSearchProductStore;
