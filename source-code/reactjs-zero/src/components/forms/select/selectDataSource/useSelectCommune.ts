import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {WardService} from "@api/WardService";

export const useSelectCommune = (district: string | null | undefined): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'CommuneBy' + district;

    return useSelectDataSource(key, async () => {
        if (!district) {
            return [];
        }
        const result = await WardService.getComboOptions({
            districtCode: district
        });
        return Utils.mapCommonSelectOption(result);
    });
};
