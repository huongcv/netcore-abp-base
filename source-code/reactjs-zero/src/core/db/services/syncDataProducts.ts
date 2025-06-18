import {SyncClientDatabaseService} from "@api/SyncClientDatabaseService";
import {db} from "@ord-core/db";
import Utils from "@ord-core/utils/utils";

export const fetchSyncDataProducts = async (isForce: boolean = false, shopId?: number) => {
    try {
        // const apiName = 'SyncClientDatabaseService.getSyncProduct';
        // if (isForce) {
        //     await db(shopId).products.clear();
        //     await db(shopId).productUnits.clear();
        //     await db(shopId).lastModificationTimeSync.delete(apiName);
        // }
        // const lastSync = await db(shopId).lastModificationTimeSync.toArray();
        // const find = lastSync.find(x => x.tableName === apiName);
        // const response = await SyncClientDatabaseService.getSyncProduct({
        //     body: {
        //         lastModificationTime: isForce ? undefined : find?.lastModificationTime,
        //         shopId: shopId
        //     }
        // });
        // if (response.products) {
        //     response.products.forEach(it => {
        //         it.fts = Utils.toLowerCaseNonAccentVietnamese([it.productName, it.productCode, it.barcode].join(' - '))
        //     });
        // }
        // if (response.productUnits) {
        //     response.productUnits.forEach(it => {
        //         it.fts = Utils.toLowerCaseNonAccentVietnamese([it.productName, it.productCode, it.unitCode, it.unitName].join(' - '))
        //     });
        // }
        // await db(shopId).lastModificationTimeSync.bulkPut([{
        //     tableName: apiName,
        //     lastModificationTime: response.newLastModificationTime
        // }]);
        // // Cập nhật vào cơ sở dữ liệu
        // await db(shopId).products.bulkPut(response.products || []);
        // await db(shopId).productUnits.bulkPut(response.productUnits || []);
    } catch {

    }
};
export const fetchSyncDataProductUnit = async (isForce: boolean = false, productId: string, shopId?: number) => {
    try {
        const apiName = 'SyncClientDatabaseService.getSyncProductUnitOf_' + productId;
        if (isForce) {
            await db(shopId).productUnits.clear();
            await db(shopId).lastModificationTimeSync.delete(apiName);
        }
        const lastSync = await db(shopId).lastModificationTimeSync.toArray();
        const find = lastSync.find(x => x.tableName === apiName);
        const response = await SyncClientDatabaseService.getSyncProductUnit({
            body: {
                lastModificationTime: isForce ? undefined : find?.lastModificationTime,
                listId: [productId],
                shopId: shopId,
            }
        });
        if (response.productUnits) {
            response.productUnits.forEach(it => {
                it.fts = Utils.toLowerCaseNonAccentVietnamese([it.productName, it.productCode, it.unitCode, it.unitName].join(' - '))
            });
        }
        await db(shopId).lastModificationTimeSync.bulkPut([{
            tableName: apiName,
            lastModificationTime: response.newLastModificationTime
        }]);
        // Cập nhật vào cơ sở dữ liệu
        await db(shopId).productUnits.bulkPut(response.productUnits || []);
    } catch {

    }
};