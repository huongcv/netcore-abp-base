import {OrderStockTicketDto} from "@api/index.defs";
import {OrderStockService} from "@api/OrderStockService";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import UpsertOrderLayout from "@pages/StockManagement/OrderStock/UpsertOrderLayout";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {UpsertMoveContext} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {useGetMoveCloneOrderStock} from "@pages/StockManagement/Shared/utils/useGetMoveCloneOrderStock";
import {Form} from "antd";
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import Utils from "@ord-core/utils/utils";

const AddNewOrderStock = (props: { editData?: OrderStockTicketDto }) => {
    const [t] = useTranslation("orderStock");
    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const {stockMoveStore} = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    useEffect(() => {
        stockMoveStore.initMoveStock("order");
    }, []);

    const onSave = async (formData: any[]) => {
        console.log("formData", formData);
        // UiUtils.setBusy();

        await Promise.all(
            formData.map((itemForm) => {
                return OrderStockService.createOrUpdateMove({
                    body: {
                        ...itemForm,
                    },
                });
            })
        ).then((res) => {
            let isSuccess = false;
            res.forEach((result) => {
                if (result.isSuccessful) {
                    isSuccess = true;
                } else {
                    if (!StockUtil.HandlerError(result)) {
                        ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
                            ...formData,
                        });
                    }
                }
            });
            if (isSuccess) {
                UiUtils.showSuccess(t("saveDone"));
                navigate(pathNameRef.current + "/order");
            }
        });
    };
    const {cloneTicket} = useGetMoveCloneOrderStock(OrderStockService.getById);
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
                <UpsertOrderLayout onSave={onSave} cloneTicketDto={cloneTicket}/>
            </UpsertMoveContext.Provider>
        </>
    );
};
export default observer(AddNewOrderStock);
