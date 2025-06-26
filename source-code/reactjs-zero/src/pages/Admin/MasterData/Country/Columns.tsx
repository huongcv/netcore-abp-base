import {TableColumnsType} from "antd";
import {CountryPagedDto} from "@api/base/index.defs";
import {ColumnBuilder, ColumnPresets} from "@ord-components/paged-table/columns";
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
export const getCountryColumns = () => {
    return new ColumnBuilder<CountryPagedDto>()
        .addText({
            title: 'ma_quoc_gia',
            dataIndex: 'code',
            width: 120,
            copyable: true,
        })
        .addText({
            title: 'ten_quoc_gia',
            dataIndex: 'name',
            minWidth: 200,
            copyable: true
        })
        .addText({
            title: 'currency_code',
            dataIndex: 'currencyCode',
            width: 120,
        })
        .addText({
            title: 'phone_code',
            dataIndex: 'phoneCode',
            width: 120,
        })
        .addDate(ColumnPresets.creationTime())
        .addCustom(IsActivedColumn())
        // .addBoolean({
        //     title: 'status',
        //     dataIndex: 'isActived',
        //     width: 100,
        //     trueText: 'Hoạt động',
        //     falseText: 'Tạm dừng',
        //     showIcon: true
        // })
        .build();
};