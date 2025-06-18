import {fetchSyncDataPartnersByType} from "@ord-core/db/services/syncDataPartners";
import {db} from "@ord-core/db";

export const getPartnerCustomerById = async (params: {
    partnerId?: string,
    code?: string,
    codeOrPhone?: string
}) => {
    await fetchSyncDataPartnersByType(false, [1, 5]);
    return db().partners
        .filter(itemDb => {
            const temp1 = itemDb.isDeleted !== true && itemDb.isActived !== false &&
                (itemDb.type === 1 || itemDb.type === 5);
            if (params.partnerId) {
                return temp1 && itemDb.id === params.partnerId;
            } else if (params.code) {
                return temp1 && itemDb.code === params.code;
            } else if (params.codeOrPhone) {
                return temp1 && (itemDb.phone === params.codeOrPhone || itemDb.code == params.codeOrPhone);
            }
            return false;
        })
        .first();
};
