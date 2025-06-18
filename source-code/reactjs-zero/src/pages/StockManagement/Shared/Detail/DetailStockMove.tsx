import {observer} from "mobx-react-lite";
import {Modal} from "antd";
import {useStore} from "@ord-store/index";
import React from "react";
import DetailStockMoveFooterModal from "@pages/StockManagement/Shared/Detail/FooterModal";
import './detail.scss';
import {ColumnType} from "antd/es/table";
import {ImportStockMoveDetailDto} from "@api/index.defs";
import DetailContent from "@pages/StockManagement/Shared/Detail/DetailContent";
import {StockMoveTypeDisplay} from "@ord-components/displays/StockMoveTypeDisplay";

const DetailStockMove = (props: {
    extendColumns?: ColumnType<ImportStockMoveDetailDto>[];
    readOnly?: boolean,
}) => {
    const {detailStockStore} = useStore();
    const {ticketDto, isModalOpen} = detailStockStore;
    return (<>
        <Modal title={<StockMoveTypeDisplay value={ticketDto?.moveDto?.moveType}/>}
               width={'90vw'}
               style={{top: 5}}
               open={isModalOpen}
               onCancel={detailStockStore.closeModal}
               footer={props.readOnly ? null : <DetailStockMoveFooterModal moveDto={ticketDto?.moveDto}/>}
        >
            {
                ticketDto &&
                <DetailContent ticketDto={ticketDto}
                               extendColumns={props.extendColumns}></DetailContent>

            }

        </Modal>

    </>);
}
export default observer(DetailStockMove);
