import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {useTranslation} from "react-i18next";
import {SelectDataSource} from "./selectDataSource";
import Utils from "@ord-core/utils/utils";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

export const useSelectVoucherType = (): SelectDataSource => {
    const {t} = useTranslation("enum");
    const key = "discountType";
    return useSelectDataSource(key, async () => {
        return [
            {
                value: DiscountTypeEnum.Percent,
                label: t("discountType.Percent"),
                fts: Utils.toLowerCaseNonAccentVietnamese(t("discountType.Percent")),
            },
            {
                value: DiscountTypeEnum.Value,
                label: t("discountType.Value"),
                fts: Utils.toLowerCaseNonAccentVietnamese(t("discountType.Value")),
            },
        ];
    });
};
