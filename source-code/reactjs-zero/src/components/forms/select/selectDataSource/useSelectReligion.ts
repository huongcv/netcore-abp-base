import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";

export const useSelectReligion = (): SelectDataSource => {
    const key = 'Religion';

    return useSelectDataSource(key, async () => {
        return [{
            value: "Khong",
            label: "Không",
            // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
        }];
    });
};
