import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";

const useFilterProductInventoryAvailable = (inventoryId: number, productId: number) => {
    return useLiveQuery(
        async () => {
            const lines = await db().inventoryLines
                .filter(it =>
                    !it.isDeleted &&
                    // @ts-ignore
                    it.inventoryId === inventoryId &&
                    // @ts-ignore
                    it.productId === productId
                )
                .toArray();
            // Tính tổng qty
            return lines.reduce((sum, line) => sum + (line.qty || 0), 0);
        },
        [inventoryId, productId]
    );
};

export default useFilterProductInventoryAvailable;
