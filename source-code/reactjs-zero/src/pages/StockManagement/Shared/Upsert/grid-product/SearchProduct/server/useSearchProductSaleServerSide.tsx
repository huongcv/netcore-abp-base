import { ProductHelperService } from "@api/ProductHelperService";
import {
    useSearchProductServerBase
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/server/useSearchProductServerBase";
import { ProductSearchRenderSaleItem } from "./ProductSearchRenderSaleItem";


export const useSearchProductSaleServerSide = (
    searchValue: string,
    focusReady: boolean,
    loadMore: number,
    moveTypeValue: any,
    inventoryId: number | undefined, onlyInShop: boolean, priceListId?: number) => {

    const params = {
        moveType: moveTypeValue,
        inventoryId: inventoryId, 
        onlyShop: onlyInShop, 
        priceListId: priceListId
    };

    return useSearchProductServerBase(
        searchValue,
        focusReady,
        loadMore,
        ProductHelperService.searchWithUnit,
        params,
        ProductSearchRenderSaleItem
    );
}
