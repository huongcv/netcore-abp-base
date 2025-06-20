export const fetchSyncDataInventoryLine = async (isForce: boolean = false) => {
    try {
        // const apiName = 'SyncClientDatabaseService.getSyncInventoryLine';
        // if (isForce) {
        //     await db().inventoryLines.clear();
        //     await db().lastModificationTimeSync.delete(apiName);
        // }
        // const lastSync = await db().lastModificationTimeSync.toArray();
        // const find = lastSync.find(x => x.tableName === apiName);
        // const response = await SyncClientDatabaseService.getSyncInventoryLine({
        //     body: {
        //         lastModificationTime: isForce ? undefined : find?.lastModificationTime
        //     }
        // });
        // await db().lastModificationTimeSync.bulkPut([{
        //     tableName: apiName,
        //     lastModificationTime: response.newLastModificationTime
        // }]);
        // // Cập nhật vào cơ sở dữ liệu
        // await db().inventoryLines.bulkPut(response?.lines || []);
    } catch {

    }
};
