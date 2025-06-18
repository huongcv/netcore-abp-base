import {Table} from 'dexie';
import {ProductSyncDto} from "@api/index.defs";


export type ProductsTable = {
    products: Table<ProductSyncDto>;
};

export const productsSchema = {
    products: '++id,idHash, productCode, productName'
};
