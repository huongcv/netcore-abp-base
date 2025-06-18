import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";

export const useSelectProductUnitBase = (): SelectDataSource => {
    const {t} = useTranslation('product-group-list');
    const key = 'ProductUnitBase';

    return useSelectDataSource(key, async () => {
        return [{
            value: 'Thùng > Hộp > Viên',
            label: 'Thùng > Hộp > Viên',
            fts: 'thv thung hop vien'
        },
            {
                value: 'Thùng > Hộp > Lọ',
                label: 'Thùng > Hộp > Lọ',
                fts: 'thl thung hop lo'
            }];
    });
};
