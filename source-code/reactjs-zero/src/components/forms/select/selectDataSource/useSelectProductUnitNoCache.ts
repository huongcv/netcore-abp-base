import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {ComboOptionDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ProductUnitService} from "@api/ProductUnitService";

export const useSelectProductUnitNoCache = (productHashId: string): SelectDataSource => {
    const key = 'ProductUnitNoCache-' + productHashId;

    return useSelectDataSource(key, async () => {
        const result = await ProductUnitService.getListByProduct({
            productHashId: productHashId
        });

        const options = result?.map(it => {
            return {
                value: it.id,
                displayName: it.unitName,
                fts: Utils.toLowerCaseNonAccentVietnamese(it.unitName || ''),
                data: it
            }
        }) as ComboOptionDto[];

        return Utils.mapCommonSelectOption(options);
    });
};
