import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {RolePagedDto} from "@api/base/index.defs";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";

export const getRoleTemplateColumns = () => {
    const builder = new ColumnBuilder<RolePagedDto>();
    builder.addText({
        title: 'code',
        dataIndex: 'code',
        width: 200,
        copyable: true,
    }).addText({
        title: 'name',
        dataIndex: 'name',
        width: 300,
    }).addText({
        title: 'description',
        dataIndex: 'description',
        minWidth: 250
    }).addCustom(IsActivedColumn())
    return builder.build();
}