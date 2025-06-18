import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import { AccountMoveReasonTypeService } from "@api/AccountMoveReasonTypeService";

export const useSelectReasonType = (): SelectDataSource => {
    const key = 'ReasonType';

    return useSelectDataSource(key, async () => {
        const result = await AccountMoveReasonTypeService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
