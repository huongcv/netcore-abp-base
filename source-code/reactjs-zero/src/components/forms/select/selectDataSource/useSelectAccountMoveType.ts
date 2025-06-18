import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useTranslation} from "react-i18next";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectAccountMoveType = (): SelectDataSource => {
    const {t} = useTranslation('enum');
    const key = 'AccountMoveType';

    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getAccountMoveType();
        return Utils.mapCommonSelectOption(result.map(x=>{
            x.displayName = t(x.displayName??"");
            return x;
        }));
    });
};
