import {TableColumnsType} from "antd";
import {UserDto} from "@api/index.defs";
import {l} from "@ord-core/language/lang.utils";
import {LockOutlined} from "@ant-design/icons";
import {StatusCell} from "@ord-components/table/cells/StatusCell";
import React from "react";
import {UserUtilities} from "@pages/Admin/Users/user.util";

export const UserDataColumns: TableColumnsType<UserDto> = [
    {
        title: 'user_name',
        dataIndex: 'userName',
        width: 200,
    },
    {
        title: 'full_name',
        dataIndex: 'name'
    },
    {
        title: 'phone_number',
        dataIndex: 'phoneNumber',
        width: 140,
    },
    {
        title: 'email',
        dataIndex: 'email',
        width: 250,
    },
    {
        title: l.transCommon('status'),
        dataIndex: 'isActived',
        render: (_, record) => (<>
            {UserUtilities.isLocked(record) && <div className="text-red-500 mb-2">
                <LockOutlined className="me-1"/>{l.trans('status', 'locked')}
            </div>}
            < StatusCell isActived={record.isActived}/>
        </>),
        width: 180,
    }
];
