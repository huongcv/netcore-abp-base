import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";

export const useSelectIsAnyStock = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'FilterIsAnyStock';

    return useSelectDataSource(key, async () => {
        return [
            {
                value: null,
                label: t('all'),
            }, {
                value: true,
                label: t('isAnyStock'),
            }, {
                value: false,
                label: t('isNotAnyStock'),
            }];
    });
};
