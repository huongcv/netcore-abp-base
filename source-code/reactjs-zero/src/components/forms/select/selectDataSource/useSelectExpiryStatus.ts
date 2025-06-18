import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";

export const useExpiryDateStatus = (): SelectDataSource => {
    const {t} = useTranslation('comboEnum');
    const key = 'ComboEnum.StockExpiryStatusEnum';

    return useSelectDataSource(key, async () => {
        // const result = await ComboEnumService.stockExpiryStatus();
        // return Utils.mapCommonSelectOption(result.map(x => {
        //     x.displayName = t(x.displayName ?? "");
        //     return x;
        // }));
        return [];
    });
};
