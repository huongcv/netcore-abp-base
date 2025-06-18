import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import {CashBookService} from "@api/CashBookService";

export const useSelectCashbook = (): SelectDataSource => {
    const key = 'AccountCashbook';

    return useSelectDataSource(key, async () => {
        const result = await CashBookService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
