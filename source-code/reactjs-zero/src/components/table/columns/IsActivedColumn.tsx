import {StatusCell} from "@ord-components/table/cells/StatusCell";
import React from "react";
import {ColumnType} from "antd/es/table/interface";
import {l} from "@ord-core/language/lang.utils";
import {IsActiveStatusDisplay} from "@ord-components/common/display/Status/IsActiveStatusDisplay";

export const IsActivedColumn = (width = 120) => {
    return {
        title: l.transCommon('status'),
        dataIndex: 'isActived',
        render: (_: any, record: any) => (< StatusCell isActived={record.isActived}/>),
        width: width,
        align: 'center'
    } as ColumnType;
};
