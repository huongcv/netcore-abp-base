import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ProvinceService} from "@api/base/ProvinceService";

export const useSelectProvince = (countryCode?: string | null): SelectDataSource => {
    const key = 'ProvinceBy_' + (countryCode || 'all');
    return useSelectDataSource(key, async () => {
        const result = await ProvinceService.getComboOptions({
            body: {
                includeUnActive: false
            }
        });
        return Utils.mapCommonSelectOption(result?.data || []);
    });
};
