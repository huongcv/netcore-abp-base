import {Table} from 'dexie';

export interface LastModificationTimeSyncEntity {
    tableName: string,
    lastModificationTime?: Date
}

export type LastModificationTimeSyncTable = {
    lastModificationTimeSync: Table<LastModificationTimeSyncEntity>;
};

export const lastModificationTimeSyncSchema = {
    lastModificationTimeSync: '++tableName, lastModificationTime'
};
