import {useEffect, useState} from "react";
import {
    ProductSearchSelectRenderItem
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/select/render-options";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import useFilterProductUnitsByKey from "@ord-core/db/queries/products/useFilterProductUnitsByKey";


export const useSearchProductInDbClient = (searchValue: string,
                                           focusReady: boolean,
                                           loadMore: number,
                                           moveTypeValue: number|undefined,
                                           onlyGetProductUsingInventory: boolean= false,
                                           ) => {
    const [data, setData] = useState<any[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isSearchOnClient] = useState(false);
    const items = useFilterProductUnitsByKey(searchValue);
    useEffect(() => {
        let products = items || [];
        if (moveTypeValue == MoveType.PhieuKiemKho) {
            products = products.filter(x => x.isBasicUnit == true);
        }
        if(onlyGetProductUsingInventory){
            products = products.filter(x => x.isProductUseInventory == true);
        }
        const optionSelectItems = products.map(it => ProductSearchSelectRenderItem(it));
        setData(optionSelectItems || []);
        setIsPending(false);
    }, [items]);
    return {data, isPending, isSearchOnClient};
}
