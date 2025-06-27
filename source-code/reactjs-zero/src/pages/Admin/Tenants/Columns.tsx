import {CountryPagedDto} from "@api/base/index.defs";
import {ColumnBuilder, ColumnPresets} from "@ord-components/paged-table/columns";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";

export const getTenantColumns = () => {
    return new ColumnBuilder<CountryPagedDto>()
        .addText({
            title: 'tenant_code',
            dataIndex: 'code',
            width: 200,
            copyable: true,
        })
        .addText({
            title: 'tenant_name',
            dataIndex: 'name',
            width: 200,
            copyable: true
        })
        .addText({
            title: 'phoneNumber',
            dataIndex: 'phoneNumber',
            width: 160,
            copyable: true
        })
        .addText({
            title: 'address',
            dataIndex: 'address',
            minWidth: 200
        })
        .addDate(ColumnPresets.creationTime())
        .addCustom(IsActivedColumn())
        .build();
};