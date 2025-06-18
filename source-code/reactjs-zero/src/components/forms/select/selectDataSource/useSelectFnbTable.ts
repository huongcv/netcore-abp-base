import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {FnbTableService} from "@api/FnbTableService";

export const useSelectFnbTable = (): SelectDataSource => {
    const key = 'FnbTable';

    return useSelectDataSource(key, async () => {
        const result = await FnbTableService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
