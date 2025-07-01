import {ColumnType} from "antd/es/table/interface";
import {CountryImportDto} from "@api/base/index.defs";
import {ImportErrorCell} from "@ord-components/excel/import-excel/ErrorCell";
import TableUtil from "@ord-core/utils/table.util";


export const getProvinceImportColumns = (isValid: boolean): ColumnType<CountryImportDto>[] => {
    return TableUtil.getColumns([
        {
            key: "error",
            minWidth: 300,
            hidden: isValid,
            render: (_, dto) => {
                return <ImportErrorCell errors={dto.errorMessages || []}/>;
            },
        },
        {
            title: 'code',
            dataIndex: 'code',
            minWidth: 200,
            ellipsis: true,
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: 200,
            ellipsis: true,
        },
        {
            dataIndex: 'countryCode',
            title: 'ma_quoc_gia',
            width: 200,
            ellipsis: true,
        },
        {
            dataIndex: 'level',
            title: 'cap',
            minWidth: 200,
            ellipsis: true,
        }
    ]);
};