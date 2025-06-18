import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useTranslation} from "react-i18next";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import {WardService} from "@api/WardService";

export const useSelectWard = (districtCode: string | null | undefined): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'wardBy' + districtCode;

    return useSelectDataSource(key, async () => {
        if (!districtCode) {
            return [];
        }
        const result = await WardService.getComboOptions({
            districtCode: districtCode
        });
        return Utils.mapCommonSelectOption(result);
    });
};
