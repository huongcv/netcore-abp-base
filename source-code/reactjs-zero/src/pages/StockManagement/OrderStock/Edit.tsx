import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import AddNewOrderStock from "@pages/StockManagement/OrderStock/AddNew";
import {OrderStockService} from "@api/OrderStockService";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";

const EditOrderStock = () => {
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
            const ticket = await OrderStockService.getById({
                idHash: id
            });
            const data = {
                ...ticket
            } as any;
            delete data[StockMoveFormName.ProductItems];
            data[StockMoveFormName.ProductItemsFromShop] = {
                shopId: ticket.moveDto?.supplierId,
                [StockMoveFormName.ProductItems]: ticket.items
            }
            setTicketDto(data);

        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    return (
        <>
            {
                tickedDto && <AddNewOrderStock editData={tickedDto}/>
            }
        </>

    );
}
export default observer(EditOrderStock);
