import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectCustomerGroupType = (): SelectDataSource => {
    const {t} = useTranslation('enum');
    const key = 'CustomerGroupType';

    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getPatnerType();
        return Utils.mapCommonSelectOption(result.map(x=>{
            x.displayName = t(x.displayName??"");
            return x;
        }));
    });
};
