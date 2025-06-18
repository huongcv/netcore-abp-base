import { ComboEnumService } from "@api/ComboEnumService";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { useTranslation } from "react-i18next";
import { SelectDataSource } from "./selectDataSource";
import Utils from "@ord-core/utils/utils";

export enum DiscountUseType {
  Voucher = 1,
  Coupon = 2,
}

export const useSelectDiscountUseType = (): SelectDataSource => {
  const { t } = useTranslation("comboEnum");
  const key = "discountUseType";
  return useSelectDataSource(key, async () => {
    const result = await ComboEnumService.getShopDiscountUseType();
    return Utils.mapCommonSelectOption(
      result.map((x) => {
        x.displayName = t(x.displayName ?? "");
        return x;
      })
    );
  });
};
