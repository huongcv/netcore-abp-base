import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ProductGroupService} from "@api/ProductGroupService";

export const useSelectProductGroup = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'ProductGroup';

    return useSelectDataSource(key, async () => {
        const result = await ProductGroupService.getComboOptions({});
        return Utils.mapCommonSelectOption(result);
    });
};
