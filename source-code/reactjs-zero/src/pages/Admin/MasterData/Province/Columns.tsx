import {ProvincePagedDto} from "@api/base/index.defs";
import {ColumnBuilder, ColumnPresets} from "@ord-components/paged-table/columns";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";

export const getProvinceColumns = () => {
    return new ColumnBuilder<ProvincePagedDto>()
        .addText({
            title: 'ma_tinh',
            dataIndex: 'code',
            width: 120,
            color: 'success',
            fontWeight: 'bold',
            copyable: true,
        })
        .addText({
            title: 'ten_tinh',
            dataIndex: 'name',
            minWidth: 200,
            copyable: true
        })
        .addText({
            title: 'ten_quoc_gia',
            dataIndex: 'countryName',
            width: 200
        })
        .addDate(ColumnPresets.creationTime())
        .addCustom(IsActivedColumn())
        .build();
};