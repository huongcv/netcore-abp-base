import { AccountMoveReasonTypeService } from "@api/AccountMoveReasonTypeService";
import utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";

export function useAccountantUtils() {
    const { selectDataSourceStore } = useStore();

    const clearDatasource = (
        reasonType: number,
        isOnlyOtherType?: boolean
    ) => {
        const key = `AccountMoveReasonType_${reasonType}_${isOnlyOtherType ? 1 : 0
            }`;
        selectDataSourceStore.clearByName(key);
        selectDataSourceStore.getOptions(key, async () => {
            const result = await AccountMoveReasonTypeService.getComboOptions({
                reasonMoveType: reasonType,
                isOnlyOtherType,
            });
            return utils.mapCommonSelectOption(result);
        });
    }

    return { clearDatasource };
}


