import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {TEMPLATE_PRINTER} from "@api/index.defs";
import {TemplatePrinterService} from "@api/TemplatePrinterService";

export const useSelectTemplatePrinter = (enumId: TEMPLATE_PRINTER): SelectDataSource => {
    const {t} = useTranslation('enum');
    const key = 'templatePrinter_'+enumId;

    return useSelectDataSource(key, async () => {
        const result = await TemplatePrinterService.getCombobox({
            templatePrintEnumId: enumId
        });
        return Utils.mapCommonSelectOption(result.map(x=>{
            x.displayName = t(x.displayName??"");
            return x;
        }));
    });
};
