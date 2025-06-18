import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { SelectDataSource } from "./selectDataSource";
import Utils from "@ord-core/utils/utils";
import { GolfBuggyGroupService } from "@api/GolfBuggyGroupService";

export const useSelectBuggyGroup = (): SelectDataSource => {
    const key = 'BuggyGroup';

    return useSelectDataSource(key, async () => {
        const result = await GolfBuggyGroupService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};