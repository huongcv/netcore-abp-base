import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {CountryService} from "@api/CountryService";

export const useSelectCountry = (): SelectDataSource => {
    const key = 'Country';

    return useSelectDataSource(key, async () => {
        const result = await CountryService.getComboByCountryCodeOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
