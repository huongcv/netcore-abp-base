import Utils from "@ord-core/utils/utils";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useTranslation } from "react-i18next";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";
import { useStore } from "@ord-store/index";

export const useSelectEInvoiceMethod = (): SelectDataSource => {
    const { t } = useTranslation('enum');
    const key = 'EInvoiceMethod';

    const { sessionStore } = useStore();


    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getEinvoiceMethod();
         return Utils.mapCommonSelectOption(result.map(x => {
                x.displayName = t("EinvoiceMethod." + x.displayName);
                return x;
            }));
        
    });
};
