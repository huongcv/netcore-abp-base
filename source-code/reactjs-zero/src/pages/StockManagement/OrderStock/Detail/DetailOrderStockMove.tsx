import { observer } from "mobx-react-lite";
import { Col, Modal, Row } from "antd";
import { useStore } from "@ord-store/index";
import React from "react";
import DetailStockMoveFooterModal from "@pages/StockManagement/Shared/Detail/FooterModal";
// import './detail.scss';
import { ColumnType } from "antd/es/table";
import { ImportStockMoveDetailDto, OrderStockMoveDto } from "@api/index.defs";
import DetailContent from "@pages/StockManagement/Shared/Detail/DetailContent";
import { StockMoveTypeDisplay } from "@ord-components/displays/StockMoveTypeDisplay";
import { useTranslation } from "react-i18next";
import LeftDetailOrderStockMove from "./LeftDetailOrderStockMove";
import RightDetailOrderStockMove from "./RightDetailOrderStockMove";

const DetailOrderStockMove = (props: {
  extendColumns?: ColumnType<OrderStockMoveDto>[];
  readOnly?: boolean;
}) => {
  const { detailStockStore } = useStore();
  const [t] = useTranslation("orderStock");
  const { ticketDto, isModalOpen } = detailStockStore;
  return (
    <>
      <Modal
        title={t("title-view-detail-order-stock")}
        width={"90vw"}
        style={{ top: 5 }}
        open={isModalOpen}
        onCancel={detailStockStore.closeModal}
        footer={
          props.readOnly ? null : (
            <DetailStockMoveFooterModal moveDto={ticketDto?.moveDto} />
          )
        }
      >
        <Row
          gutter={16}
          //className={"detail-move-type-" + ticketDto?.moveDto?.moveType}
        >
          <Col flex="1 1 200px">
            {ticketDto?.moveDto && ticketDto.items && (
              <LeftDetailOrderStockMove
                items={ticketDto?.items}
                moveDto={ticketDto.moveDto}
              />
            )}
          </Col>
          <Col flex="0 1 360px" className="relative">
            {ticketDto?.moveDto && (
              <RightDetailOrderStockMove
                moveDto={ticketDto.moveDto}
                ticketDto={ticketDto}
              />
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default observer(DetailOrderStockMove);
