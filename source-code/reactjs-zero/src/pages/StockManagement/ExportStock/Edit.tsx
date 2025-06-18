import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {ExportStockService} from "@api/ExportStockService";
import AddNewExportStock from "@pages/StockManagement/ExportStock/AddNew";

const EditExportStock = () => {
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
            const result = await ExportStockService.getById({
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
                tickedDto && <AddNewExportStock editData={tickedDto}/>
            }
        </>

    );
}
export default observer(EditExportStock);
