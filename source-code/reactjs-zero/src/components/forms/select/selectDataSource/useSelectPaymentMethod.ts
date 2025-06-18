import Utils from "@ord-core/utils/utils";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useTranslation } from "react-i18next";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";
import { useStore } from "@ord-store/index";

interface SelectPaymentMethodProps {
    hiddenCentralBilling?: boolean;
}

export const useSelectPaymentMethod = (props?: SelectPaymentMethodProps): SelectDataSource => {
    const { t } = useTranslation('enum');
    const key = 'PaymentMethod' + (props?.hiddenCentralBilling ? "_1": "_0");

    const { sessionStore } = useStore();


    return useSelectDataSource(key, async () => {
        const result = await ComboEnumService.getPaymentMethod();
        if (sessionStore.user?.tenantDto?.type === 100 && !props?.hiddenCentralBilling) {
            return Utils.mapCommonSelectOption(result.map(x => {
                x.displayName = t(x.displayName ?? "");
                return x;
            }));
        }

        return Utils.mapCommonSelectOption(result.filter(x => x.value != 6).map(x => {
            x.displayName = t(x.displayName ?? "");
            return x;
        }));
        
    });
};
