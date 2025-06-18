import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";
import Utils from "@ord-core/utils/utils";

export const useFilterProductByKey = (searchTerm: string | null, groupsIdList: any[]) => {
    return useLiveQuery(
        () => db().products.filter(product => {
                let ret = product.isDeleted != true;
                if (!ret) {
                    return false;
                }
                if (!Utils.isNullOrEmpty(searchTerm)) {
                    ret = ret && Utils.compareFts(product.fts || '', searchTerm);
                }
                if (!ret) {
                    return false;
                }
                if (!!groupsIdList && groupsIdList.length > 0) {
                    let ret = false;
                    groupsIdList.forEach(g => {
                        // @ts-ignore
                        if (!!product.listGroupProductId && !!g && product.listGroupProductId.indexOf((+g)) > -1) {
                            ret = true;
                        }
                    });
                    return ret;
                }
                return ret;
            }
        )
            .toArray(),
        [searchTerm, groupsIdList]
    );

};
