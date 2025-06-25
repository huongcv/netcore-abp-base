import {TableColumnsType} from "antd";
import {CountryPagedDto} from "@api/base/index.defs";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";

export const CountryDataTableColumn: TableColumnsType<CountryPagedDto> = [
    {
        title: 'ma_quoc_gia',
        dataIndex: 'code',
        width: 200
    },
    {
        title: 'ten_quoc_gia',
        dataIndex: 'name',
    },
    {
        title: 'phone_code',
        dataIndex: 'phoneCode',
        width: 200
    },
    {
        title: 'currency_code',
        dataIndex: 'currencyCode',
        width: 200
    },
    IsActivedColumn()
];