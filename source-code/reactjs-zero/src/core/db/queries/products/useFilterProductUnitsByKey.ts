import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";
import Utils from "@ord-core/utils/utils";

const useFilterProductUnitsByKey = (searchTerm?: string | null, shopId?: number) => {
    return useLiveQuery(
        () => db(shopId).productUnits.filter(product => {
                searchTerm = Utils.toLowerCaseNonAccentVietnamese(searchTerm);
                return product.isDeleted != true &&
                    (
                        Utils.isNullOrEmpty(searchTerm)
                        // @ts-ignore
                        || (!!product.fts && product.fts.indexOf(searchTerm) > -1)
                    );
            }
        )
            .toArray(),
        [searchTerm]
    );

};

export default useFilterProductUnitsByKey;
