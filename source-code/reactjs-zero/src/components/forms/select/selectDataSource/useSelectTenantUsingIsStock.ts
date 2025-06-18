import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ComboEnumService} from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";
import {ShopType} from "@api/index.defs";
import {TenantService} from "@api/TenantService";

export const useSelectTenantUsingIsStock = (): SelectDataSource => {
    const key = 'TenantUsingStock';//+ shopType;
    return useSelectDataSource(key, async () => {
        const result = await TenantService.getTenantUsingIsStock();
        return Utils.mapCommonSelectOption(result);
    });
};
