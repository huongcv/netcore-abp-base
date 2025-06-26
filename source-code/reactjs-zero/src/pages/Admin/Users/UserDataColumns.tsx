import {l} from "@ord-core/language/lang.utils";
import {LockOutlined} from "@ant-design/icons";
import {StatusCell} from "@ord-components/table/cells/StatusCell";
import React from "react";
import {UserUtilities} from "@pages/Admin/Users/user.util";
import {ColumnBuilder} from "@ord-components/paged-table/columns";
import {UserPagedDto} from "@api/base/index.defs";

export const getUserColumns = () => {
    const builder = new ColumnBuilder<UserPagedDto>();
    builder.addText({
        title: 'user_name',
        dataIndex: 'userName',
        width: 200,
        copyable: true,
    }).addText({
        title: 'full_name',
        dataIndex: 'name',
        minWidth: 200,
    }).addText({
        title: 'phone_number',
        dataIndex: 'phoneNumber',
        width: 140,
        copyable: true,
    }).addText({
        title: 'email',
        dataIndex: 'email',
        width: 250,
        copyable: true,
    }).addCustom({
        title: l.transCommon('status'),
        dataIndex: 'isActived',
        render: (_, record) => (<>
            {UserUtilities.isLocked(record) && <div className="text-red-500 mb-2">
                <LockOutlined className="me-1"/>{l.trans('status', 'locked')}
            </div>}
            < StatusCell isActived={record.isActived}/>
        </>),
        width: 180,
    });
    return builder.build();
}
export const UserDataColumns = getUserColumns();