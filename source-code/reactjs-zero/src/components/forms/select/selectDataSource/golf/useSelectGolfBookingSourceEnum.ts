import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";
import {useTranslation} from "react-i18next";

export const useSelectGolfBookingSourceEnum = (): SelectDataSource => {
    const key = 'useSelectGolfBookingSourceEnum';
    const {t} = useTranslation('enum');
    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getGolfBookingSourceEnum()
        return Utils.mapCommonSelectOption(result.map(m => {
            m.displayName = t(m.displayName ?? "");
            return m;
        }));
    });
};
