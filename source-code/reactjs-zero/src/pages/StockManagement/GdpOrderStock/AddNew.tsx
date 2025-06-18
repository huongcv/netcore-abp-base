import {observer} from "mobx-react-lite";
import {Form} from "antd";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import UiUtils from "@ord-core/utils/ui.utils";
import {useNavigate} from "react-router-dom";
import {OrderStockTicketDto} from "@api/index.defs";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {UpsertMoveContext} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {useGetMoveCloneInformation} from "@pages/StockManagement/Shared/utils/useGetMoveCloneInformation";
import {OrderStockService} from "@api/OrderStockService";
import UpsertOrderLayout from "@pages/StockManagement/OrderStock/UpsertOrderLayout";
import {useGetMoveCloneOrderStock} from "@pages/StockManagement/Shared/utils/useGetMoveCloneOrderStock";
import UpsertMoveStockLayout from "@pages/StockManagement/Shared/Upsert/UpsertLayout";

const AddNewGdpOrderStock = (props: {
    editData?: OrderStockTicketDto
}) => {
    const [t] = useTranslation('gdpOrderStock');
    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const {stockMoveStore} = useStore();
    const navigate = useNavigate();
    useEffect(() => {
        stockMoveStore.initMoveStock('gdp-order');
    }, []);

    const onSave = async (formData: any[]) => {
        console.log("formData", formData);
        // UiUtils.setBusy();

        // await Promise.all(formData.map(itemForm => {
        //     return OrderStockService.createOrUpdateMove({
        //         body: {
        //             ...itemForm
        //         }
        //     })
        // })).then(res => {
        //     let isSuccess = false;
        //     res.forEach(result => {
        //         if (result.isSuccessful) {
        //             isSuccess = true;
        //         } else {
        //             if (!StockUtil.HandlerError(result)) {
        //                 ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
        //                     ...formData
        //                 });
        //             }
        //         }
        //     })
        //     if (isSuccess) {
        //         UiUtils.showSuccess(t('saveDone'));
        //         navigate('/stock/gdp-order');
        //     }
        // })
    }
    const {cloneTicket} = useGetMoveCloneOrderStock(OrderStockService.getById);
    return (
        <>
            <UpsertMoveContext.Provider value={{
                formMoveTicket: formMoveTicket,
                formProductItems: formProductItems,
                editData: props.editData,
                t: t as any
            }}>
                <UpsertMoveStockLayout onSave={onSave} ns={'gdpOrderStock'} cloneTicketDto={cloneTicket}/>
            </UpsertMoveContext.Provider>
        </>

    )
        ;
}
export default observer(AddNewGdpOrderStock);
