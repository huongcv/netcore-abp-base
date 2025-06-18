import {StatusCell} from "@ord-components/table/cells/StatusCell";
import React from "react";
import {ColumnType} from "antd/es/table/interface";
import {l} from "@ord-core/language/lang.utils";

export const IsActivedColumn = (width = 120) => {
    return {
        title: l.transCommon('status'),
        dataIndex: 'isActived',
        render: (_: any, record: any) => (< StatusCell isActived={record.isActived}/>),
        width: width,
        align: 'center'
    } as ColumnType;
};
export const IsActivedColumnWithFilter = (width = 120) => {
    return {
        title: l.transCommon('status'),
        dataIndex: 'isActived',
        render: (_: any, record: any) => (< StatusCell isActived={record.isActived}/>),
        width: width,
        // filters: [
        //     {
        //         text: l.transCommon('dang_hoat_dong'),
        //         value: true,
        //     },
        //     {
        //         text: l.transCommon('ngung_hoat_dong'),
        //         value: false,
        //     }
        // ],
        // filterMultiple: false
    } as ColumnType;
};
