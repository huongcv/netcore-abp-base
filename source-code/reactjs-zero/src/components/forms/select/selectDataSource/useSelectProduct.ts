import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ComboEnumService} from "@api/ComboEnumService";

export const useSelectProduct = (props?: { isActive?: boolean }): SelectDataSource => {
    const key = 'ProductCombo';
    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getProduct({isActive: props?.isActive});
        return Utils.mapCommonSelectOption(result);
    });
};
