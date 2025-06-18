import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";
import Utils from "@ord-core/utils/utils";
import {useEffect, useState} from "react";
import {fetchSyncDataPartnersByType} from "@ord-core/db/services/syncDataPartners";

export const useFilterPartnerCustomerByText = (searchTerm?: string | null) => {
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        fetchSyncDataPartnersByType(false, [1, 5])
            .then(() => setIsDataFetched(true));
    }, []);
    // useEffect(() => {
    //     fetchSyncDataPartnersByType(false, [1, 5])
    //         .then(() => setIsDataFetched(true));
    // }, [searchTerm]);

    return useLiveQuery(
        () => db().partners.filter(itemDb => {
                searchTerm = Utils.toLowerCaseNonAccentVietnamese(searchTerm);
                return itemDb.isDeleted != true && itemDb.isActived != false &&
                    (
                        itemDb.type == 1 || itemDb.type == 5
                    ) &&
                    (
                        Utils.isNullOrEmpty(searchTerm)
                        // @ts-ignore
                        || (!!itemDb.fts && itemDb.fts.indexOf(searchTerm) > -1)
                    );
            }
        )
            .toArray(),
        [searchTerm, isDataFetched]
    );

};
