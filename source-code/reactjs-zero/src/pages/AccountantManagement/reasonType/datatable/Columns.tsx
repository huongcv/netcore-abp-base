import {ColumnType} from "antd/es/table/interface";
import {MoveReasonTypeDto} from "@api/index.defs";
import {IsActivedColumnWithFilter} from "@ord-components/table/columns/IsActivedColumn";
import React from "react";
import {ReasonTypeCell} from "@pages/AccountantManagement/reasonType/datatable/ReasonTypeCell";
import {AccountMoveTypeCell} from "@pages/AccountantManagement/reasonType/datatable/AccountMoveTypeCell";
import { PartnerAccountMoveTypeCell } from "./PartnerAccountMoveTypeCell";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

export const ReasonTypeDtColumns: ColumnType<MoveReasonTypeDto>[] = [
    {
        dataIndex: 'reasonTypeName',
        title: 'reasonTypeName',
        width: 300,
        render: (v) => {
            return <TextLineClampDisplay content={v} />
        }
    },
    {
        dataIndex: 'reasonMoveType',
        title: 'type',
        width: 200,
        render: value => {
            return <AccountMoveTypeCell value={value}/>
        }
    },
    IsActivedColumnWithFilter()
];
