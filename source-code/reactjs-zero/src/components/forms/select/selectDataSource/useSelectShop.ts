import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ShopService } from "@api/ShopService";

export const useSelectShop = (disableTenant?: boolean,
                              excludeShopIds?: string[],
                              disableShopIds?: number[]
): SelectDataSource => {
    const key = (excludeShopIds && excludeShopIds.length > 0) ? 'ShopId_exclude' : 'ShopId';

    return useSelectDataSource(key, async () => {
        const result = await ShopService.getComboOptions({
            body: {
                disableTenant: disableTenant,
                excludeShopIds
            }
        });
        return Utils.mapCommonSelectOption(result.map(x=> {
            x.disabled = disableShopIds?.includes(x.value);
            return x;
        }));
    });
};