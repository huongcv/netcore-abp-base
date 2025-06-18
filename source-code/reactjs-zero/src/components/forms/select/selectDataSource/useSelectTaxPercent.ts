import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectTaxCode = (): SelectDataSource => {
    const key = 'TaxCode';
    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getTaxPercent();
        return Utils.mapCommonSelectOption(result);
    });
};
