import {StockMoveItemShortDto, StockMovePagedOutputDto} from "@api/index.defs";
import {List, Popover, Space, Tag, Typography} from "antd";
import DateUtil from "@ord-core/utils/date.util";
import React, {useEffect, useState} from "react";
import {StockMoveHelperService} from "@api/StockMoveHelperService";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {DollarOutlined} from "@ant-design/icons";
import {MoveTypeCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveTypeCell";

export const MoveCodeCellReadOnly = (props: {
    record: StockMovePagedOutputDto
}) => {
    const {record} = props;
    return (<>
        <div>
            <span className='underline font-bold'>{record.moveCode}</span>
        </div>
        <Space>
           <span className='italic'>
                {DateUtil.showWithFormat(record.moveDate, 'dd/MM/yyyy HH:mm')}
           </span>
        </Space>

    </>);
}

export const MoveCodeCell = (props: {
    record: StockMovePagedOutputDto,
    viewDetail: (dto: StockMovePagedOutputDto) => void,
    hiddenMoveType?: boolean
}) => {
    const {record, hiddenMoveType} = props;
    const handlerView = () => {
        props.viewDetail(record);
    }
    return (<>
        <a className='underline font-semibold' onClick={handlerView}>{record.moveCode}</a> <br/>

        <span className='italic'>
                {DateUtil.showWithFormat(record.moveDate, 'dd/MM/yyyy HH:mm')}
           </span>
        {
            hiddenMoveType != true &&
            <Tag>
                <MoveTypeCell record={record}/>
            </Tag>
        }

    </>);

}

