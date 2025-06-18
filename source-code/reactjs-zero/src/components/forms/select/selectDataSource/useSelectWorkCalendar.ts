import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ShopWorkCalendarService} from "@api/ShopWorkCalendarService";

export const useSelectWorkCalendar = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'ShopWorkCalendar';

    return useSelectDataSource(key, async () => {
        const result = await ShopWorkCalendarService.getComboOptions({});
        return Utils.mapCommonSelectOption(result);
    });
};
