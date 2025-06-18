import { FnbAreaService } from "@api/FnbAreaService";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";

export const useSelecFnbArea = (): SelectDataSource => {
    const key = 'FnbArea';

    return useSelectDataSource(key, async () => {
        const result = await FnbAreaService.getComboOptions({});
        return Utils.mapCommonSelectOption(result);
    });
};
