import {ImportStockService} from "@api/ImportStockService";
import {ImportStockTicketDto} from "@api/index.defs";
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

const AddNewImportStock = (props: { editData?: ImportStockTicketDto }) => {
    const [t] = useTranslation("stock");
    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const {stockMoveStore} = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    useEffect(() => {
        stockMoveStore.initMoveStock("import");
    }, []);

    const {cloneTicket} = useGetMoveCloneInformation(
        ImportStockService.cloneById
    );

    const onSave = async (formData: any) => {
        UiUtils.setBusy();
        try {
            const result = await ImportStockService.createOrUpdateMove({
                body: {
                    ...formData,
                },
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(t("saveDone"));
                navigate(pathNameRef.current + "/import");
            } else {
                if (!StockUtil.HandlerError(result)) {
                    ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
                        ...formData,
                    });
                }
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            UiUtils.clearBusy();
        }
    };

    return (
        <>
            <UpsertMoveContext.Provider
                value={{
                    formMoveTicket: formMoveTicket,
                    formProductItems: formProductItems,
                    editData: props.editData,
                    t: t as any,
                }}
            >
                <UpsertMoveStockLayout onSave={onSave} cloneTicketDto={cloneTicket}/>
            </UpsertMoveContext.Provider>
        </>
    );
};
export default observer(AddNewImportStock);
