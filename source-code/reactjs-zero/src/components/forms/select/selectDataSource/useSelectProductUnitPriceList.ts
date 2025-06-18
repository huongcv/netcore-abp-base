import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ProductHelperService} from "@api/ProductHelperService";
import {ComboOptionDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";

export const useSelectProductUnitPriceList = (productId: any, priceListId: any): SelectDataSource => {

    const key = 'ProductUnitPriceList' + productId + priceListId;

    return useSelectDataSource(key, async () => {
        if (!productId) {
            return [];
        }
        const combo = await ProductHelperService.getUnitsByPriceListId({
            body: {
                productId: productId,
                priceListId: priceListId
            }
        })
        return combo.map(it => {
            return {
                value: it.productUnitId,
                label: it.unitName,
                fts: Utils.toLowerCaseNonAccentVietnamese(it.unitName || ''),
                data: it
            }
        }) as ComboOptionDto[]
    });
};
