import { useTranslation } from "react-i18next";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";
import { SelectDataSource } from "../selectDataSource";

export const useAccessCardTypeEnum = (): SelectDataSource => {
  const { t } = useTranslation("enum");
  const key = "AccessCardTypeEnum";

  return useSelectDataSource(key, async () => {
    const result = await ComboEnumService.getAccessCardTypeEnum();
    return Utils.mapCommonSelectOption(
      result.map((x) => {
        x.displayName = t(x.displayName ?? "");
        return x;
      })
    );
  });
};
