import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";

export const useSelectMarital = (): SelectDataSource => {
    const key = 'marital';

    return useSelectDataSource(key, async () => {
        return [
            {
                value: 1,
                label: "Độc thân",
                // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
            },
            {
                value: 2,
                label: "Đã kết hôn",
                // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
            },
            {
                value: 3,
                label: "Đã ly hôn",
                // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
            },
        ];
    });
};
