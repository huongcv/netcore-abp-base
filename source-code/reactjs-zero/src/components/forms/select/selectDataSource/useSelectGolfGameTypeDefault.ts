import { useTranslation } from "react-i18next";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ProductGroupService } from "@api/ProductGroupService";
import { GolfAreaService } from "@api/GolfAreaService";
import { ComboEnumService } from "@api/ComboEnumService";

export const useSelectGolfGameTypeDefault = (): SelectDataSource => {
    const { t } = useTranslation('enum');
        const key = 'GolfGameTypeDefault';
    
        return useSelectDataSource(key, async () => {
            const result = await ComboEnumService.getGameType();
            return Utils.mapCommonSelectOption(result.map(x => {
                x.displayName = t(x.displayName ?? "");
                return x;
            }));
        });
};
