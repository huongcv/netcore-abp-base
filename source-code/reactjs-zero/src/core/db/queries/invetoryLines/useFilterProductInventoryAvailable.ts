import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@ord-core/db";

const useFilterProductInventoryAvailable = (inventoryId?: number) => {
  return useLiveQuery(
    () =>
      db()
        .inventoryLines.filter((it) => {
          return (
            it.isDeleted != true &&
            it.inventoryId == inventoryId &&
            !!it.qty &&
            it.qty > 0
          );
        })
        .toArray(),
    [inventoryId]
  );
};
export default useFilterProductInventoryAvailable;
