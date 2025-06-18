import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";

export const useFilterProductPriceListDetailById = (id?: string | null) => {
    return useLiveQuery(
        () => db().productPriceListDetails.filter(itemDb => {
                console.log('priceListId', id)
                return itemDb.isDeleted != true &&
                    (
                        itemDb.priceListId == id
                    );
            }
        )
            .toArray(),
        [id]
    );

};
