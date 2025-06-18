import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import AddNew from "./AddNew";
import { SaleOrderService } from "@api/SaleOrderService";

const EditSaleOrder = () => {
    let {id} = useParams();
    const [saleOrderDto, setSaleOrderDto] = useState<any>(null);
    useEffect(() => {
        if (id) {
            loadSaleOrder().then();
        }
    }, [id]);

    const loadSaleOrder = async () => {
        UiUtils.setBusy();
        try {
            const result = await SaleOrderService.getSaleOrderById({
                idHash: id as string
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            setSaleOrderDto(result.data);

        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    return (
        <>
            {
                saleOrderDto && <AddNew editData={saleOrderDto}/>
            }
        </>

    );
}
export default observer(EditSaleOrder);
