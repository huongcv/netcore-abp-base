import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";

export enum CalculateUsePrice {
    GIA_CHUNG = '1',
    GIA_VON = '2',
    GIA_HIEN_TAI = '3',
}

export const useSelectPriceListCalculate = (): SelectDataSource => {
    const key = 'job';

    return useSelectDataSource(key, async () => {
        return [
            {
                value: "1",
                label: "Giá chung",
            },
            {
                value: "2",
                label: "Giá vốn",
            },
            {
                value: "3",
                label: "Giá hiện tại",
            }];
    });
};
