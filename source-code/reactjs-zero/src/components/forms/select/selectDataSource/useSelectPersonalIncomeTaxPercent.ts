import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectPersonalIncomeTaxCode = (): SelectDataSource => {
    const key = 'PersonalIncomeTaxCode';
    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getPersonalIncomeTaxPercent();
        return Utils.mapCommonSelectOption(result);
    });
};
