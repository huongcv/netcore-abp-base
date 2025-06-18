import {observer} from "mobx-react-lite";
import {Form} from "antd";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import UpsertMoveStockLayout from "@pages/StockManagement/Shared/Upsert/UpsertLayout";
import UiUtils from "@ord-core/utils/ui.utils";
import {useNavigate} from "react-router-dom";
import {ImportStockTicketDto} from "@api/index.defs";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import {ExportStockService} from "@api/ExportStockService";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {UpsertMoveContext} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {useGetMoveCloneInformation} from "@pages/StockManagement/Shared/utils/useGetMoveCloneInformation";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import Utils from "@ord-core/utils/utils";

const AddNewExportStock = (props: {
    editData?: ImportStockTicketDto
}) => {
    const [t] = useTranslation('stock');
    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const {stockMoveStore} = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));
    
    useEffect(() => {
        stockMoveStore.initMoveStock('export');
        stockMoveStore.initMoveType(MoveType.PhieuXuatTraNhaCungCap);
    }, []);
    const onSave = async (formData: any) => {
        UiUtils.setBusy();
        try {
            const result = await ExportStockService.createOrUpdateMove({
                body: {
                    ...formData
                }
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(t('saveDone'));
                navigate(pathNameRef.current + '/export-supplier');
            } else {
                if (!StockUtil.HandlerError(result)) {
                    ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
                        ...formData
                    });
                }
            }

        } catch {

        } finally {
            UiUtils.clearBusy();
        }


    }
    const {cloneTicket} = useGetMoveCloneInformation(ExportStockService.cloneById);

    return (
        <>
            <UpsertMoveContext.Provider value={{
                formMoveTicket: formMoveTicket,
                formProductItems: formProductItems,
                editData: props.editData,
                t: t as any
            }}>
                <UpsertMoveStockLayout onSave={onSave} cloneTicketDto={cloneTicket}/>
            </UpsertMoveContext.Provider>


        </>

    )
        ;
}
export default observer(AddNewExportStock);
