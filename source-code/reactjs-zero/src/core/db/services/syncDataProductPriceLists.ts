import {SyncClientDatabaseService} from "@api/SyncClientDatabaseService";
import {db} from "@ord-core/db";

export const fetchSyncDataProductPriceLists = async (isForce: boolean = false) => {
    try {
        // const apiName = 'SyncClientDatabaseService.getSyncProductPriceList';
        // if (isForce) {
        //     await db().productPriceLists.clear();
        //     await db().productPriceListDetails.clear();
        //     await db().lastModificationTimeSync.delete(apiName);
        // }
        // const lastSync = await db().lastModificationTimeSync.toArray();
        // const find = lastSync.find(x => x.tableName === apiName);
        // const response = await SyncClientDatabaseService.getSyncProductPrice({
        //     body: {
        //         lastModificationTime: isForce ? undefined : find?.lastModificationTime
        //     }
        // });
        // await db().lastModificationTimeSync.bulkPut([{
        //     tableName: apiName,
        //     lastModificationTime: response.newLastModificationTime
        // }]);
        // // Cập nhật vào cơ sở dữ liệu
        // await db().productPriceLists.bulkPut(response.productPriceLists || []);
        // await db().productPriceListDetails.bulkPut(response.productPriceListDetails || []);
    } catch {

    }
};
