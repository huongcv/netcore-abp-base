import { useTranslation } from "react-i18next";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";
import { SelectDataSource } from "../selectDataSource";

export const useLoyaltyTierLevelEnum = (): SelectDataSource => {
  const { t } = useTranslation("enum");
  const key = "LoyaltyTierLevelEnum";

  return useSelectDataSource(key, async () => {
    const result = await ComboEnumService.getLoyaltyTierLevelEnum();
    return Utils.mapCommonSelectOption(
      result.map((x) => {
        x.displayName = t(x.displayName ?? "");
        return x;
      })
    );
  });
};
