import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {CountryStateService} from "@api/CountryStateService";

export const useSelectProvince = (): SelectDataSource => {
    const key = 'Province';

    return useSelectDataSource(key, async () => {
        const result = await CountryStateService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
