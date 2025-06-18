import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";

export const useSelectJob = (): SelectDataSource => {
    const key = 'job';

    return useSelectDataSource(key, async () => {
        return [{
            value: "TD",
            label: "Tự do",
            // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
        }];
    });
};
