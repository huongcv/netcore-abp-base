import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";

export const useSelectEthnic = (): SelectDataSource => {
    const key = 'Ethnic';

    return useSelectDataSource(key, async () => {
        return [{
            value: "KI",
            label: "Kinh",
            // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
        }, {
            value: "HOA",
            label: "Hoa",
            // fts: Utils.toLowerCaseNonAccentVietnamese(t('feMale'))
        }];
    });
};
