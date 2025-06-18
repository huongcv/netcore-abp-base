import {StockHelperService} from "@api/StockHelperService";
import {
    useSearchProductServerBase
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/server/useSearchProductServerBase";
import {
    ProductSearchSelectRenderServerSideItem
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/server/ProductSearchSelectRenderServerSideItem";
import { ProductHelperService } from "@api/ProductHelperService";


export const useSearchProductServerSide = (
    searchValue: string,
    focusReady: boolean,
    loadMore: number,
    moveTypeValue: any,
    inventoryId: number | undefined, onlyInShop: boolean, priceListId?: number) => {

    const params = {
        moveType: moveTypeValue,
        inventoryId: inventoryId, 
        onlyShop: onlyInShop, 
    };

    return useSearchProductServerBase(
        searchValue,
        focusReady,
        loadMore,
        ProductHelperService.searchWithUnit,
        params,
        ProductSearchSelectRenderServerSideItem
    );
}
