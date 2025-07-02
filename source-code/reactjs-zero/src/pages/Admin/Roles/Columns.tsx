import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {RolePagedDto} from "@api/base/index.defs";
import {l} from "@ord-core/language/lang.utils";
import {UserOutlined} from "@ant-design/icons";
import React from "react";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {useListUsersInRoleModal} from "@pages/Admin/Roles/hook/useListUsersInRoleModal";

export const getRoleColumns = (callBack: () => void) => {
    const {openListUsersInRoleModal} = useListUsersInRoleModal();
    const builder = new ColumnBuilder<RolePagedDto>();

    builder.addText({
        title: 'code',
        dataIndex: 'code',
        width: 200,
        copyable: true,
    }).addText({
        title: 'name',
        dataIndex: 'name',
        width: 250,
    }).addCustom({
        title: 'user_assigned_role_count',
        dataIndex: 'userAssignedCount',
        width: 150,
        minWidth: 150,
        align: 'right',
        render: (value, dto) => <>
            <a onClick={() => {
                openListUsersInRoleModal(dto, () => {
                    callBack();
                });
            }} title={l.transCommon("view_list_detail")}>
                <span className={'me-2'}>{value}</span>
                <UserOutlined/>
            </a>
        </>
    }).addText({
        title: 'description',
        dataIndex: 'description',
        minWidth: 250
    }).addCustom(IsActivedColumn())
    return builder.build();
}