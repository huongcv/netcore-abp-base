import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import {ACCOUNT_MOVE_TYPE, MoveReasonTypeDto} from "@api/index.defs";
import { AccountMoveReasonTypeService } from "@api/AccountMoveReasonTypeService";

export const ComboKeyMoveReasonType = (reasonType: ACCOUNT_MOVE_TYPE, isOnlyOtherType?: boolean) => {
    return `AccountMoveReasonType_${reasonType}_${isOnlyOtherType ? 1 : 0}`;
};

export const useSelectMoveReasonType = (reasonType: ACCOUNT_MOVE_TYPE, isOnlyOtherType ?: boolean): SelectDataSource => {
    const key = ComboKeyMoveReasonType(reasonType, isOnlyOtherType)

    return useSelectDataSource(key, async () => {
        const result = await AccountMoveReasonTypeService.getComboOptions({
            reasonMoveType: reasonType, 
        });

        return Utils.mapCommonSelectOption(result);
    });
};


export const MoveReasonTypeRenderSelectItem = (dto: MoveReasonTypeDto) => {
    return {
        value: dto.id,
        label: dto.reasonTypeName,
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.reasonTypeName,
        ]),
    }
}


export const MoveReasonTypeLabel = (props: {
    dto: MoveReasonTypeDto
}) => {
    const {dto} = props;
    return (<>
        {
            dto && (<>
                {dto?.reasonTypeName}
            </>)

        }
    </>)
}
