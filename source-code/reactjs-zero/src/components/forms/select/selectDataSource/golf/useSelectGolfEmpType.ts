import { useTranslation } from "react-i18next";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";

export const useSelectGolfEmpTypeEnum = (): SelectDataSource => {
  const { t } = useTranslation("employee");
  const key = "golfEmployeeCategory";

  return useSelectDataSource(key, async () => {
    const result = await ComboEnumService.getGolfEmployeeType();
    return Utils.mapCommonSelectOption(
      result.map((x) => {
        x.displayName = t(x.displayName ?? "");
        return x;
      })
    );
  });
};