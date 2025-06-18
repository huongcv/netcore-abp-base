import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ComboEnumService} from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";
import {ShopType} from "@api/index.defs";
import {TenantService} from "@api/TenantService";
import {ShopService} from "@api/ShopService";

export const useSelectShopUsingIsStock = (): SelectDataSource => {
    const key = 'ShopUsingStock';
    return useSelectDataSource(key, async () => {
        const result = await ShopService.getShopUsingIsStock();
        return Utils.mapCommonSelectOption(result);
    });
};
