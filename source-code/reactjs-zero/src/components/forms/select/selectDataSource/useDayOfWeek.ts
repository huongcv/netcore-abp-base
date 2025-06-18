import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {DAY_OF_WEEK} from "@api/index.defs";

export const useDayOfWeek = (): SelectDataSource => {
    const key = 'dayOfWeek';
    const {t} = useTranslation('enum');

    return useSelectDataSource(key, async () => {
        return [{
            value: 0  as DAY_OF_WEEK,
            label: t('dayOfWeek.SUNDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.SUNDAY'))
        },{
            value: 1  as DAY_OF_WEEK,
            label: t('dayOfWeek.MONDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.MONDAY'))
        },{
            value: 2  as DAY_OF_WEEK,
            label: t('dayOfWeek.TUESDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.TUESDAY'))
        },{
            value: 3  as DAY_OF_WEEK,
            label: t('dayOfWeek.WEDNESDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.WEDNESDAY'))
        },{
            value:4  as DAY_OF_WEEK,
            label: t('dayOfWeek.THURSDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.THURSDAY'))
        },{
            value: 5  as DAY_OF_WEEK,
            label: t('dayOfWeek.FRIDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.FRIDAY'))
        },{
            value: 6  as DAY_OF_WEEK,
            label: t('dayOfWeek.SATURDAY'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('dayOfWeek.SATURDAY'))
        },

        ];
    });
};
