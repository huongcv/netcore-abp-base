import {ProductDto} from "@api/index.defs";
import {action, makeObservable, observable} from "mobx";
import ProductInventoryStockListStore from "@ord-store/Product/productInventoryStockStore";
import ProductInventoryMoveListStore from "@ord-store/Product/productInventoryMoveStore";

class ProductStockDetailStore {
    isModalOpen = false;
    productDto: ProductDto | undefined | null = null;
    inventoryStockListStore: ProductInventoryStockListStore;
    inventoryMoveListStore: ProductInventoryMoveListStore;
    widthModal = '90vw';

    constructor() {
        makeObservable(this, {
            isModalOpen: observable,
            productDto: observable,
            inventoryStockListStore: observable,
            widthModal: observable,
            closeModal: action
        });
    }


    openModal = (productDto: ProductDto) => {
        if (productDto.isProductUseInventory == true) {
        this.widthModal = '90vw';
        }else{
            this.widthModal = '600px';
        }
        this.productDto = {...productDto};
        this.isModalOpen = true;
        this.inventoryStockListStore = new ProductInventoryStockListStore();
        this.inventoryMoveListStore = new ProductInventoryMoveListStore();
    }
    initData = (productDto: ProductDto) => {
        this.productDto = {...productDto};
        this.inventoryStockListStore = new ProductInventoryStockListStore();
        this.inventoryMoveListStore = new ProductInventoryMoveListStore();
    }
    closeModal = () => {
        this.isModalOpen = false;
        this.productDto = null;
    }

}

export default ProductStockDetailStore;
