import {TransferStockTicketDto} from "@api/index.defs";
import {TransferStockService} from "@api/TransferStockService";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import UpsertMoveStockLayout from "@pages/StockManagement/Shared/Upsert/UpsertLayout";
import {UpsertMoveContext} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {useGetMoveCloneInformation} from "@pages/StockManagement/Shared/utils/useGetMoveCloneInformation";
import {Form} from "antd";
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Utils from "@ord-core/utils/utils";

const AddNewTransferStock = (props: { editData?: TransferStockTicketDto }) => {
    const [t] = useTranslation("transferStock");
    const [tstock] = useTranslation("stock");
    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const {stockMoveStore} = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    useEffect(() => {
        stockMoveStore.initMoveStock("transfer");
    }, []);

    const onSave = async (formData: any) => {
        UiUtils.setBusy();
        try {
            const result = await TransferStockService.createOrUpdateMove({
                body: {
                    ...formData,
                },
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(tstock("saveDone"));
                navigate(pathNameRef.current + "/transfer");
                // fetchSyncDataInventoryLine().then();
            } else {
                if (!StockUtil.HandlerError(result)) {
                    ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
                        ...formData,
                    });
                }
            }
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };
    const {cloneTicket} = useGetMoveCloneInformation(
        TransferStockService.cloneById
    );
    return (
        <>
            <UpsertMoveContext.Provider
                value={{
                    formMoveTicket: formMoveTicket,
                    formProductItems: formProductItems,
                    editData: props.editData,
                    t: tstock as any,
                }}
            >
                <UpsertMoveStockLayout onSave={onSave} cloneTicketDto={cloneTicket}/>
            </UpsertMoveContext.Provider>
        </>
    );
};
export default observer(AddNewTransferStock);
