import {Table} from 'dexie';
import {PartnerSyncDto} from "@api/index.defs";


export type PartnerTable = {
    partners: Table<PartnerSyncDto>;
};

export const partnerSchema = {
    partners: '++id,lastModificationTime,isDeleted,name,code'
};
