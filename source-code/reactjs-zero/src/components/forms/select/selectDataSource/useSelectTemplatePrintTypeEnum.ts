import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {TEMPLATE_PRINTER} from "@api/index.defs";
import {TemplatePrinterService} from "@api/TemplatePrinterService";
import { ComboEnumService } from "@api/ComboEnumService";

export const useSelectTemplatePrintTypeEnum = (): SelectDataSource => {
    const key = 'TemplatePrintTypeEnum';

    return useSelectDataSource(key, async () => {
           const combo = await ComboEnumService.getTemplatePrintTypeEnum();
           return Utils.mapCommonSelectOption(combo, 'comboEnum');
       });
};
