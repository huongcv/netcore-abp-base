import { useTranslation } from "react-i18next";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";
import { SelectDataSource } from "../selectDataSource";

export const useGolferMemberTypeEnum = (): SelectDataSource => {
  const { t } = useTranslation("enum");
  const key = "GolferMemberTypeEnum";

  return useSelectDataSource(key, async () => {
    const result = await ComboEnumService.getGolferMemberTypeEnum();
    return Utils.mapCommonSelectOption(
      result.map((x) => {
        x.displayName = t(x.displayName ?? "");
        return x;
      })
    );
  });
};
