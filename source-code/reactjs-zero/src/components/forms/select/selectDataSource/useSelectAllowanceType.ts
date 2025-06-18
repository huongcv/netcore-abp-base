import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ALOWANCE_TYPE} from "@api/index.defs";

export const useSelectAllowanceType = (): SelectDataSource => {
    const key = 'allowanceType';
    const {t} = useTranslation('enum');

    return useSelectDataSource(key, async () => {
        return [{
            value: 1  as ALOWANCE_TYPE,
            label: t('allowance.Month'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('allowance.Month'))
        }, {
            value: 2 as ALOWANCE_TYPE,
            label: t('allowance.Day'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('allowance.Day'))
        }];
    });
};
