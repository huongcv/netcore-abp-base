import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ComboEnumService} from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";
import {ShopType} from "@api/index.defs";

export const useSelectProductType = (shopType?: ShopType): SelectDataSource => {
    const {t} = useTranslation('comboEnum');
    const key = 'ProductType_';//+ shopType;
    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getProductType({
            shopType: undefined,//shopType
        });
        return Utils.mapCommonSelectOption(result.map(x => {
            x.displayName = t(x.displayName ?? "");
            return x;
        }));
    });
};
