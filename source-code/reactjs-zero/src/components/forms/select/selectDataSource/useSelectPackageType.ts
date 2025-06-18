import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useTranslation} from "react-i18next";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";

export const useSelectPackageType = (): SelectDataSource => {
    const {t} = useTranslation('enum');
    const key = 'PackageType';

    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getPackageType();
        return Utils.mapCommonSelectOption(result.map(x=>{
            x.displayName = t(x.displayName??"");
            return x;
        }));
    });
};
