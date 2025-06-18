import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectProductDrugCategory = (): SelectDataSource => {
    const {t} = useTranslation('enum');
    const key = 'ProductDrugCategory';

    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getProductDrugCategory();
        return Utils.mapCommonSelectOption(result.map(x => {
            x.displayName = t(x.displayName ?? "");
            return x;
        }));
    });
};
