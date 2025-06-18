import {ExportStockMoveDto, ImportStockTicketDto} from "@api/index.defs";
import {Modal} from "antd";
import React, {useState} from "react";
import {EyeOutlined} from "@ant-design/icons";
import {ImportStockService} from "@api/ImportStockService";
import UiUtils from "@ord-core/utils/ui.utils";
import DetailContent from "@pages/StockManagement/Shared/Detail/DetailContent";

export const RelatedMoveInfor = (props: {
    moveDto: ExportStockMoveDto
}) => {
    const {moveDto} = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticketDto, setTicketDto] = useState<ImportStockTicketDto | null>();
    const load = async () => {
        if (ticketDto) {
            return;
        }
        UiUtils.setBusy();
        try {
            const result = await ImportStockService.getById({
                idHash: props.moveDto.relatedMoveIdHash as string
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            setTicketDto(result.data);

        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    const showModal = () => {
        setIsModalOpen(true);
        load();
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (<>
        <a className={'me-1'} onClick={() => {
            showModal();
        }}><EyeOutlined/></a>
        {moveDto.relatedMoveCode}

        <Modal title={ticketDto?.moveDto?.moveCode}
               width={'100vw'}
               style={{
                   top: 0
               }}
               footer={null}
               open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {
                ticketDto && <DetailContent ticketDto={ticketDto}></DetailContent>
            }
        </Modal>
    </>);
}
