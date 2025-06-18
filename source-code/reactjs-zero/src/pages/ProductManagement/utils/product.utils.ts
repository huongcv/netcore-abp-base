import { ProductPriceListService } from "@api/ProductPriceListService";
import utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";

export function useProductPriceListUtils() {
    const { selectDataSourceStore } = useStore();

    const clearDatasource = () => {
        const key = 'ProdutPriceList'
        selectDataSourceStore.clearByName(key);
        selectDataSourceStore.getOptions(key, async () =>  {
            const result = await ProductPriceListService.getComboOptions();
            return utils.mapCommonSelectOption(result);
            
        });
    };

    return { clearDatasource };
}