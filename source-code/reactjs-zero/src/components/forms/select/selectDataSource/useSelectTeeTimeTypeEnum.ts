import { useTranslation } from "react-i18next";
import { SelectDataSource } from "./selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";

export const useSelectTeeTimeType = (): SelectDataSource => {
  const { t } = useTranslation("enum");
  const key = "SelectTeeTimeType";

  return useSelectDataSource(key, async () => {
    const result = await ComboEnumService.getTeetimeTypeEnum();
    return Utils.mapCommonSelectOption(
      result.map((x) => {
        x.displayName = t(x.displayName ?? "");
        return x;
      })
    );
  });
};
