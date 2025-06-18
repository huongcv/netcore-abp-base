import { useTranslation } from "react-i18next";
import { SelectDataSource } from "./selectDataSource";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ComboEnumService } from "@api/ComboEnumService";
import Utils from "@ord-core/utils/utils";

export const useSelectBatteryType = (): SelectDataSource => {
  const { t:tEnum } = useTranslation("comboEnum");
  const key = "batteryType";

  return useSelectDataSource(key, async () => {
    const result = await ComboEnumService.getBatteryTypeEnumEnum();
    return Utils.mapCommonSelectOption(
      result.map((x) => {
        x.displayName = tEnum(`${key}.${x.value}`);
        return x;
      })
    );
  });
};