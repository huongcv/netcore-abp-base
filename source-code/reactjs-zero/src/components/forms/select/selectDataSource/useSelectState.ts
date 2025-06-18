import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {CountryStateService} from "@api/CountryStateService";

export const useSelectState = (): SelectDataSource => {
    const key = 'CountryState';

    return useSelectDataSource(key, async () => {
        const result = await CountryStateService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
