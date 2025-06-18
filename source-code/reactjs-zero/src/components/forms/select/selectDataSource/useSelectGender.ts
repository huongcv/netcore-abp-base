import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {GENDER} from "@api/index.defs";
import {useTranslation} from "react-i18next";

export const useSelectGender = (): SelectDataSource => {
    const key = 'gender';
    const {t} = useTranslation('enum');

    return useSelectDataSource(key, async () => {
        return [{
            value: 1  as GENDER,
            label: t('GENDER.MALE'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('GENDER.MALE'))
        }, {
            value: 2 as GENDER,
            label: t('GENDER.FEMALE'),
            fts: Utils.toLowerCaseNonAccentVietnamese(t('GENDER.FEMALE'))
        }];
    });
};
