import {ColumnType} from "antd/es/table/interface";
import {CountryImportDto} from "@api/base/index.defs";
import {ImportErrorCell} from "@ord-components/import-excel/ErrorCell";
import TableUtil from "@ord-core/utils/table.util";


export const getProductGroupColumns = (isValid: boolean): ColumnType<CountryImportDto>[] => {
    return TableUtil.getColumns([
        {
            key: "error",
            width: 300,
            hidden: isValid,
            render: (_, dto) => {
                return <ImportErrorCell errors={dto.errorMessages || []}/>;
            },
        },
        {
            title: 'ma_quoc_gia',
            dataIndex: 'code',
            width: 200,
            ellipsis: true,
        },
        {
            title: 'ten_quoc_gia',
            dataIndex: 'name',
            width: 200,
            ellipsis: true,
        },
        {
            dataIndex: 'phoneCode',
            title: 'phoneCode',
            width: 200,
            ellipsis: true,
        },
        {
            dataIndex: 'currencyCode',
            title: 'currencyCode',
            width: 200,
            ellipsis: true,
        }
    ]);
};