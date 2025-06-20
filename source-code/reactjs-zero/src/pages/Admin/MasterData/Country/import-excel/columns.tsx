import {ColumnType} from "antd/es/table/interface";
import {useTranslation} from "react-i18next";
import {CountryImportDto} from "@api/base/index.defs";
import {ImportErrorCell} from "@ord-components/import-excel/ErrorCell";


export const getProductGroupColumns = (isValid: boolean): ColumnType<CountryImportDto>[] => {
    const {t} = useTranslation("field");

    return [
        {
            key: "error",
            width: 300,
            hidden: isValid,
            render: (_, dto) => {
                return <ImportErrorCell errors={dto.errorMessages || []}/>;
            },
        },
        {
            title: t("code"),
            dataIndex: "code",
            width: 200,
            ellipsis: true,
        },
        {
            title: t("name"),
            dataIndex: "name",
            width: 200,
            ellipsis: true,
        },
        {
            title: t("Notes"),
            dataIndex: "notes",
            width: 300,
            ellipsis: true,
        },
        {
            title: t("IsProductGroupChain"),
            dataIndex: "isProductGroupChainStr",
            width: 150,
            ellipsis: true,
        },
    ];
};