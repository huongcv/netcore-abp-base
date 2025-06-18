import { makeAutoObservable } from "mobx";

class OrderFilterStore {
    areaId: number | null = null;
    filterTable: string = '';
    timeStampTableFilter: number | null = null;
    timeStampOrderListFilter: number | null = null;
    productGroupId: number | null = null;
    filterFood: string = '';
    priceListId: any | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAreaId(value: number | null) {
        this.areaId = value;
    }

    setFilterTable(value: string) {
        this.filterTable = value;
    }

    setTimeStampTableFilter(value: number) {
        this.timeStampTableFilter = value;
    }

    setTimeStampOrderListFilter(value: number) {
        this.timeStampOrderListFilter = value;
    }

    setProductGroupId(value: number | null) {
        this.productGroupId = value;
    }

    setFilterFood(value: string) {
        this.filterFood = value;
    }

    setPriceListId(value: any | null) {
        this.priceListId = value;
    }
}

export const orderFilterStore = new OrderFilterStore();
