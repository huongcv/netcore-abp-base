import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import utils from "@ord-core/utils/utils";
import { useTranslation } from "react-i18next";

export const useSelectCustomPartnerType = (): SelectDataSource => {
    const key = 'partnerCategory';
    const {t} = useTranslation('customer');
    return useSelectDataSource(key, async () => {
        return [{
            value: 1,
            label: t('category.individual'),
            fts: utils.toLowerCaseNonAccentVietnamese(t('category.individual'))
        }, {
            value: 2,
            label: t('category.organization'),
            fts: utils.toLowerCaseNonAccentVietnamese(t('category.organization'))
        }];
    });
};
