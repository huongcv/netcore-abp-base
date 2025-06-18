import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";

export const useSelectCustomerType = (): SelectDataSource => {
    const key = 'useSelectCustomer';

    return useSelectDataSource(key, async () => {
        return [
            {
                value: 1,
                label: "Khách hàng mới",
                // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
            },
            {
                value: 2,
                label: "Khách hàng quay lại",
                // fts: Utils.toLowerCaseNonAccentVietnamese(t('male'))
            },
        ];
    });
};
