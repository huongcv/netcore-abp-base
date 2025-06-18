import {Table} from 'dexie';
import {InventoryLineSyncDataDto} from "@api/index.defs";


export type InventoryLinesTable = {
    inventoryLines: Table<InventoryLineSyncDataDto>;
};

export const inventoryLinesSchema = {
    inventoryLines: '++id,productId,lotNumber,expiryDate,qty'
};
