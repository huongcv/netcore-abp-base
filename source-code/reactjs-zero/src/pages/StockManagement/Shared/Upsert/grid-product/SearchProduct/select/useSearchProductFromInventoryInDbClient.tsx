import {useEffect, useState} from "react";
import {
    ProductFromInventorySearchSelectRenderItem,
    ProductSearchSelectRenderItem
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/select/render-options";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import useFilterProductUnitsByKey from "@ord-core/db/queries/products/useFilterProductUnitsByKey";
import {WardService} from "@api/WardService";
import Utils from "@ord-core/utils/utils";
import {ProductHelperService} from "@api/ProductHelperService";


export const useSearchProductFromInventoryInDbClient = (searchValue: string,
) => {
    const [data, setData] = useState<any[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isSearchOnClient] = useState(false);
    // const items = useFilterProductUnitsByKey(searchValue);
    useEffect(() => {
        setIsPending(true);
       ProductHelperService.getPagingProductInfoFromInventoryAvailable({
            body: {
                filter: searchValue,
                skipCount: 0,
                maxResultCount: 1000
            }
        }).then(res => {
            const optionSelectItems = res.items?.map(it => ProductFromInventorySearchSelectRenderItem(it));
            setData(optionSelectItems || []);
            setIsPending(false);
        })

    }, [searchValue]);
    return {data, isPending, isSearchOnClient};
}
