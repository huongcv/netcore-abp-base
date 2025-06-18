import BaseDexie from 'dexie';
import {productsSchema, ProductsTable} from "@ord-core/db/tables/products";
import {productUnitsSchema, ProductUnitsTable} from "@ord-core/db/tables/productUnits";
import {
    lastModificationTimeSyncSchema,
    LastModificationTimeSyncTable
} from "@ord-core/db/tables/lastModificationTimeEntity";
import {inventoryLinesSchema, InventoryLinesTable} from "@ord-core/db/tables/inventoryLine";
import {partnerSchema, PartnerTable} from "@ord-core/db/tables/partner";
import {AppBootstrapDto} from "@api/index.defs";
import {
    productPriceListDetailsSchema,
    ProductPriceListDetailsTable,
    productPriceListsSchema,
    ProductPriceListsTable
} from "@ord-core/db/tables/productPriceLists";

type DexieTables = ProductsTable
    & ProductUnitsTable
    & LastModificationTimeSyncTable
    & InventoryLinesTable
    & PartnerTable
    & ProductPriceListsTable
    & ProductPriceListDetailsTable;
export type Dexie<T extends any = DexieTables> = BaseDexie & T;


class OrdDbClientDexie {
    // private _db: Dexie;
    private _databases: Map<number, Dexie> = new Map();
    private DEFAULT_SHOP_ID : number ;

    setDbName(appBootstrapDto: AppBootstrapDto) {
        let shopIdHash = appBootstrapDto?.currentShop;
        if (!shopIdHash) {
            // cho từng tenantId nếu ko có currentShopHashId
            // @ts-ignore
            shopIdHash = appBootstrapDto.user?.tenantId;
        }
        this.DEFAULT_SHOP_ID = shopIdHash || 0;
        this.db();
    }
    private createDb(shopId: number): Dexie {
        const dbName = `OrdCorePos-${shopId}`;
        const db = new BaseDexie(dbName) as Dexie;
        const schema = Object.assign({},
            productsSchema,
            productUnitsSchema,
            lastModificationTimeSyncSchema,
            inventoryLinesSchema,
            partnerSchema,
            productPriceListsSchema,
            productPriceListDetailsSchema);
        db.version(1).stores(schema);
        return db;
    }

    db(shopId: number = this.DEFAULT_SHOP_ID): Dexie {
        if (!this._databases.has(shopId)) {
            this._databases.set(shopId, this.createDb(shopId));
        }
        return this._databases.get(shopId)!;
    }
}

export const OrdDbClient = new OrdDbClientDexie();
export const db = (shopId?: number) => OrdDbClient.db(shopId);


//const dbName = 'OrdCorePos-' + window.localStorage.getItem('dbName');

// const schema = Object.assign({},
//     productsSchema,
//     productUnitsSchema,
//     lastModificationTimeSyncSchema,
//     inventoryLinesSchema,
//     partnerSchema);
// db.version(1).stores(schema);
