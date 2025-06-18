import {Col, Row} from "antd";
import DetailStockMoveProductListItems from "@pages/StockManagement/Shared/Detail/ProductLists/ProductListItems";
import StockMoveRightBox from "@pages/StockManagement/Shared/Detail/RightBox";
import React from "react";
import {ImportStockMoveDetailDto, ImportStockTicketDto} from "@api/index.defs";
import {ColumnType} from "antd/es/table";
import './detail.scss';

const DetailContent = (props: {
    ticketDto: ImportStockTicketDto;
    extendColumns?: ColumnType<ImportStockMoveDetailDto>[];
}) => {
    const {
        ticketDto
    } = props;
    return (<Row gutter={16} className={'detail-move-type-' + ticketDto?.moveDto?.moveType}>
        <Col flex="1 1 200px">
            {
                ticketDto.moveDto && ticketDto.items &&
                <DetailStockMoveProductListItems items={ticketDto?.items}
                                                 extendColumns={props.extendColumns}
                                                 moveDto={ticketDto.moveDto}/>
            }

        </Col>
        <Col flex="0 1 360px" className='relative'>
            {
                ticketDto.moveDto && <StockMoveRightBox moveDto={ticketDto.moveDto}
                                                        ticketDto={ticketDto}/>
            }
        </Col>
    </Row>);
}
export default DetailContent;
