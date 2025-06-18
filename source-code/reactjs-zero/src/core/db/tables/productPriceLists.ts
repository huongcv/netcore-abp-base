import {Table} from 'dexie';
import {ProductPriceListDetailSyncDto, ProductPriceListSyncDto} from "@api/index.defs";


export type ProductPriceListsTable = {
    productPriceLists: Table<ProductPriceListSyncDto>;
};

export const productPriceListsSchema = {
    productPriceLists: '++id,name,startDate,endDate'
};


export type ProductPriceListDetailsTable = {
    productPriceListDetails: Table<ProductPriceListDetailSyncDto>;
};

export const productPriceListDetailsSchema = {
    productPriceListDetails: '++id,priceListId,productId,productUnitId'
};
