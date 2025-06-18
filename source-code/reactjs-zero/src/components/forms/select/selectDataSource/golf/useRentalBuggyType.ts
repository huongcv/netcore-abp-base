import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";
import {useTranslation} from "react-i18next";

export const useRentalBuggyType = (): SelectDataSource => {
    const key = 'RentalBuggyType';
    const {t} = useTranslation('enum');

    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getGolfProductRentalBuggyTypeEnum();
        return Utils.mapCommonSelectOption(
            result.map((x) => {
                x.displayName = t(x.displayName ?? "");
                return x;
            })
        );
    });
};
