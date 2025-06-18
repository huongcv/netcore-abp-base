import {Table} from 'dexie';
import {ProductUnitSyncDto} from "@api/index.defs";


export type ProductUnitsTable = {
    productUnits: Table<ProductUnitSyncDto>;
};

export const productUnitsSchema = {
    productUnits: '++id,productId,productUnitId,unitCode, unitName,productCode, productName,convertRate'
};
