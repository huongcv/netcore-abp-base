import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {RolePagedDto} from "@api/base/index.defs";
import {l} from "@ord-core/language/lang.utils";
import {UserOutlined} from "@ant-design/icons";
import React from "react";
import {roleUserListModalStore} from "@pages/Admin/Roles/ListUsers/Modal";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";

export const getRoleColumns = () => {
    const builder = new ColumnBuilder<RolePagedDto>();
    builder.addText({
        title: 'code',
        dataIndex: 'code',
        width: 100,
        copyable: true,
    }).addText({
        title: 'name',
        dataIndex: 'name',
        width: 200,
    }).addCustom({
        title: 'user_assigned_role_count',
        dataIndex: 'userAssignedCount',
        width: 150,
        minWidth: 150,
        align: 'right',
        render: (value, dto) => <>
            <a onClick={() => {
                roleUserListModalStore.getInitialState().openModal(dto);
            }} title={l.transCommon("view_list_detail")}>
                <span className={'me-2'}>{value}</span>
                <UserOutlined/>
            </a>
        </>
    }).addNumber({
        title: 'demo',
        dataIndex: 'demo',
        valueRender: () => {
            return 1000000;
        }
    }).addText({
        title: 'description',
        dataIndex: 'description',
        minWidth: 250
    }).addCustom(IsActivedColumn())
    return builder.build();
}