import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {ImportStockService} from "@api/ImportStockService";
import AddNewImportStock from "@pages/StockManagement/ImportStock/AddNew";

const EditImportStock = () => {
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
            const result = await ImportStockService.getById({
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
                tickedDto && <AddNewImportStock editData={tickedDto}/>
            }
        </>

    );
}
export default observer(EditImportStock);
