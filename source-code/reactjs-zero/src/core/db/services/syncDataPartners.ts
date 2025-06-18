import {SyncClientDatabaseService} from "@api/SyncClientDatabaseService";
import {db} from "@ord-core/db";
import Utils from "@ord-core/utils/utils";
import {PARTNER_TYPE} from "@api/index.defs";

export const fetchSyncDataPartners = async (isForce: boolean = false) => {
    try {
        return fetchSyncDataPartnersByType(isForce, [])
    } catch {

    }
};

export const fetchSyncDataPartnersByType = async (isForce: boolean = false, partnerTypes: PARTNER_TYPE[]) => {
    try {
        const apiName = 'SyncClientDatabaseService.getSyncPartnersInType_'+ partnerTypes?.join('|');
        if (isForce) {
            await db().partners.clear();
            await db().lastModificationTimeSync.delete(apiName);
        }
        const lastSync = await db().lastModificationTimeSync.toArray();
        const find = lastSync.find(x => x.tableName === apiName);
        const response = await SyncClientDatabaseService.getSyncPartners({
            body: {
                lastModificationTime: isForce ? undefined : find?.lastModificationTime
            }
        });
        if (response.partners) {
            response.partners.forEach(it => {
                it.fts = Utils.toLowerCaseNonAccentVietnamese([it.name, it.code, it.phone, it.address].join(' - '))
            });
        }
        await db().lastModificationTimeSync.bulkPut([{
            tableName: apiName,
            lastModificationTime: response.newLastModificationTime
        }]);
        // Cập nhật vào cơ sở dữ liệu
        await db().partners.bulkPut(response.partners || []);
    } catch {

    }
};
