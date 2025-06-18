import { useTranslation } from "react-i18next";

export const ProductHeaderTable = () => {

    const { t } = useTranslation('order');

    const thClassName = "py-2 px-1 border-b border-gray-200 text-left text-gray-600";

    return (
        <tr>
            <th className={`${thClassName} w-[30px] text-center`}>#</th>
            <th className={`${thClassName} w-[200px]`}>{t("product")}</th>
            <th className={`${thClassName} w-[200px]`}>{t("Cửa hàng")}</th>
            <th className={`${thClassName} w-[80px] text-right`}>{t("qty")}</th>
            <th className={`${thClassName} w-[100px]`}>{t("unit")}</th>
            <th className={`${thClassName} w-[150px] text-right`}>
                {t("price")}
            </th>
            <th className={`${thClassName} w-[150px] text-center`}>
                {t("discount")}
            </th>
            <th className={`${thClassName} w-[150px] text-right`}>
                {t("totalAmountDetail")}
            </th>
            <th className={`${thClassName} w-[30px] text-right`}></th>
        </tr>
    )
}