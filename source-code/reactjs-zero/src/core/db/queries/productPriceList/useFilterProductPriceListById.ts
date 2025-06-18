import {useLiveQuery} from "dexie-react-hooks";
import {db} from "@ord-core/db";


export const useFilterProductPriceListById = (id?: string | null) => {
    return useLiveQuery(async () => {
        // Lấy thông tin từ productPriceLists
        const priceList = await db().productPriceLists
            .filter(itemDb =>
                itemDb.isDeleted !== true &&
                ((!id && itemDb.isMain) || (itemDb.id === id))
            )
            .first();

        if (priceList) {
            // Lấy danh sách details dựa trên priceListId
            const details = await db().productPriceListDetails
                .filter(detail => detail.priceListId === priceList.id)
                .toArray();

            return { priceList, details };
        }

        return null; // Trả về null nếu không tìm thấy priceList nào
    }, [id]);
};

export default useFilterProductPriceListById;
