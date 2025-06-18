import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectProductGroupType = (): SelectDataSource => {
    const key = 'ProductGroupType';

    return useSelectDataSource(key, async () => {
        const combo = await ComboEnumService.getProductGroupType();
        return Utils.mapCommonSelectOption(combo, 'comboEnum');
    });
};
