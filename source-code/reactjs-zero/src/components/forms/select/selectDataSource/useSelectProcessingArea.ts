import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import {FnbProcessingAreaService} from "@api/FnbProcessingAreaService";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";

export const useSelectProcessingArea = (): SelectDataSource => {
    const key = 'ProcessingArea';

    return useSelectDataSource(key, async () => {
        const result = await FnbProcessingAreaService.getComboOptions({});
        return Utils.mapCommonSelectOption(result);
    });
};
