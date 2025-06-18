import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectStockMoveType = (groupName: string): SelectDataSource => {
    const key = 'StockMoveType_' + groupName;

    return useSelectDataSource(key, async () => {
        if (!groupName) {
            return [];
        }
        const result = await ComboEnumService.getStockMoveType({
            groupMove: groupName
        });
        return Utils.mapCommonSelectOption(result,'comboEnum');
    });
};
