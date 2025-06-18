import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";

export const useSelectIsActived = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'FilterIsActived';

    return useSelectDataSource(key, async () => {
        return [{
            value: true,
            label: t('dang_hoat_dong'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dang_hoat_dong'))
        }, {
            value: false,
            label: t('ngung_hoat_dong'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('ngung_hoat_dong'))
        }];
    });
};
