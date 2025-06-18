import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import AddNewGdpOrderStock from "@pages/StockManagement/GdpOrderStock/AddNew";
import {GdpOrderStockService} from "@api/GdpOrderStockService";

const EditGdpOrderStock = () => {
    let {id} = useParams();
    const [tickedDto, setTicketDto] = useState<any>(null);
    useEffect(() => {
        if (id) {
            loadMoveTicket().then();
        }
    }, [id]);
    const loadMoveTicket = async () => {
        UiUtils.setBusy();
        try {
            const ticket = await GdpOrderStockService.getById({
                idHash: id
            });
            setTicketDto(ticket);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    }

    return (
        <>
            {
                tickedDto && <AddNewGdpOrderStock editData={tickedDto}/>
            }
        </>

    );
}
export default observer(EditGdpOrderStock);
