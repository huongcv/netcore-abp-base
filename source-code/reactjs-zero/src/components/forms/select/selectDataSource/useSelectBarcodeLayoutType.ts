import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ComboEnumService} from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";

export const useSelectBarcodeLayoutType = (): SelectDataSource => {
    const {t} = useTranslation('comboEnum');
    const key = 'BarcodeLayout';

    return useSelectDataSource(key, async () => {
        const combo = await ComboEnumService.getProductBarcodeLayout();
        return Utils.mapCommonSelectOption(combo, 'comboEnum');
    });
};
