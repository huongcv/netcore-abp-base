import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {CheckStockService} from "@api/CheckStockService";
import AddNewCheckStock from "@pages/StockManagement/CheckStock/AddNew";

const EditCheckStock = () => {
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
            const result = await CheckStockService.getById({
                idHash: id as string
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

    return (
        <>
            {
                tickedDto && <AddNewCheckStock editData={tickedDto}/>
            }
        </>

    );
}
export default observer(EditCheckStock);
