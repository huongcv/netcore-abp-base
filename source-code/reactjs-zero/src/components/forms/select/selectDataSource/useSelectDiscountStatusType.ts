import { ComboEnumService } from "@api/ComboEnumService";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { useTranslation } from "react-i18next";
import { SelectDataSource } from "./selectDataSource";
import Utils from "@ord-core/utils/utils";
import { DISCOUNTSTATUS } from "@api/index.defs";

export const useSelectDiscountStatusType = (): SelectDataSource => {
  const { t } = useTranslation("enum");
  const key = "discountStatus";

  return useSelectDataSource(key, async () => {
    return [
      {
        value: 1 as DISCOUNTSTATUS,
        label: t("discountStatus.Active"),
        fts: Utils.toLowerCaseNonAccentVietnamese(t("discountStatus.Active")),
      },
      {
        value: 2 as DISCOUNTSTATUS,
        label: t("discountStatus.Inactive"),
        fts: Utils.toLowerCaseNonAccentVietnamese(t("discountStatus.Inactive")),
      },
      {
        value: 3 as DISCOUNTSTATUS,
        label: t("discountStatus.Expired"),
        fts: Utils.toLowerCaseNonAccentVietnamese(t("discountStatus.Expired")),
      },
    ];
  });
};
