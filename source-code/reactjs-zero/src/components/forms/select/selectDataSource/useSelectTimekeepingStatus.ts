import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {DAY_OF_WEEK, TIMEKEEPING_STATUS} from "@api/index.defs";

export const useSelectTimekeepingStatus = (): SelectDataSource => {
    const key = 'timekeepingStatus';
    const {t} = useTranslation('enum');

    return useSelectDataSource(key, async () => {
        return [{
            value:1  as TIMEKEEPING_STATUS,
            label: t('timesheet.detail.valid'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('timesheet.detail.valid'))
        },{
            value: 2  as TIMEKEEPING_STATUS,
            label: t('timesheet.detail.authorized.leave'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('timesheet.detail.authorized.leave'))
        },{
            value: 3  as TIMEKEEPING_STATUS,
            label: t('timesheet.detail.unauthorized.leave'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('timesheet.detail.unauthorized.leave'))
        }        ];
    });
};
