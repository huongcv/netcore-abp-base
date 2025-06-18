import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ProductPriceListService} from "@api/ProductPriceListService";

export const useSelectProductPriceList = (): SelectDataSource => {
    const key = 'ProductPriceList';

    return useSelectDataSource(key, async () => {
        const result = await ProductPriceListService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
