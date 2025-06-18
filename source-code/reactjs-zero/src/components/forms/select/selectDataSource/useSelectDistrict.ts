import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {DistrictService} from "@api/DistrictService";

export const useSelectDistrict = (state: string | null | undefined): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'districtBy' + state;

    return useSelectDataSource(key, async () => {
        if (!state) {
            return [];
        }
        const result = await DistrictService.getComboOptions({
            stateCode: state
        });
        return Utils.mapCommonSelectOption(result);
    });
};
