import { useTranslation } from "react-i18next";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { GolfAccessCardColorService } from "@api/GolfAccessCardColorService";

export const useSelectGolfAccessCardColor = (): SelectDataSource => {
    const { t } = useTranslation('common');
    const key = 'GolfAccessCardColor';

    return useSelectDataSource(key, async () => {
        const result = await GolfAccessCardColorService.getComboOptions({});
        return Utils.mapCommonSelectOption(result);
    });
};
