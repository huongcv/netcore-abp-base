import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useTranslation} from "react-i18next";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import {ComboEnumService} from "@api/ComboEnumService";
import {ShopTemplateService} from "@api/ShopTemplateService";
import {ShopTemplateTypeEnum} from "@api/index.defs";

export const useSelectShopTemplateType = (): SelectDataSource => {
    const {t} = useTranslation('enum');
    const key = 'ShopTemplateType';

    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getShopTemplateType();
        return Utils.mapCommonSelectOption(result.map(x=>{
            x.displayName = t(x.displayName??"");
            return x;
        }));
    });
};
