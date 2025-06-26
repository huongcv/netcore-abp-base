import {CountryPagedDto} from "@api/base/index.defs";
import {ColumnBuilder, ColumnPresets} from "@ord-components/paged-table/columns";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";

export const getCountryColumns = () => {
    return new ColumnBuilder<CountryPagedDto>()
        .addText({
            title: 'ma_quoc_gia',
            dataIndex: 'code',
            width: 120,
            color: 'success',
            fontWeight: 'bold',
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
            width: 120
        })
        .addText({
            title: 'phone_code',
            dataIndex: 'phoneCode',
            width: 120,
        })
        .addDate(ColumnPresets.creationTime())
        .addCustom(IsActivedColumn())
        .build();
};