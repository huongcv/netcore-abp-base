import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";

const useFilterInventoryLineByProduct = (inventoryId?: number | string, productId?: number | string) => {
    return useLiveQuery(
        () => db().inventoryLines.filter(it => {
                return it.isDeleted != true
                    && it.productId == productId
                    && it.inventoryId == inventoryId;
            }
        )
            .toArray(),
        [inventoryId, productId]
    );

};

export default useFilterInventoryLineByProduct;
