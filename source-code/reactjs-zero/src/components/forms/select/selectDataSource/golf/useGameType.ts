import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";

export const useGameType = (): SelectDataSource => {
    const key = 'GameType';

    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getGameType()
        return Utils.mapCommonSelectOption(result);
    });
};
