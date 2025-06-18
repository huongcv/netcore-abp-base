import {ColumnType} from "antd/es/table/interface";

export const RowIdxColumn: ColumnType = {
    title: '#',
    render: (_, _1, idx) => {
        return idx + 1;
    },
    width: 30
}
