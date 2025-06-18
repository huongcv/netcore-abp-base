import { CheckStockService } from "@api/CheckStockService";
import { CheckStockTicketDto, SaleOrderDto } from "@api/index.defs";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { StockUtil } from "@pages/StockManagement/Shared/StockUtil";
import UpsertMoveStockLayout from "@pages/StockManagement/Shared/Upsert/UpsertLayout";
import { UpsertMoveContext } from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import { useGetMoveCloneInformation } from "@pages/StockManagement/Shared/utils/useGetMoveCloneInformation";
import { Form } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Utils from "@ord-core/utils/utils";
import CrudSaleOrderForm from "./Form/CrudSaleOrderForm";
import uiUtils from "@ord-core/utils/ui.utils";
import { SaleOrderService } from "@api/SaleOrderService";

const AddNewSaleOrder = (props: {
    editData?: SaleOrderDto
}) => {
    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const navigate = useNavigate();
    const { saleOrderStore: mainStore } = useStore();
    const { t } = useTranslation('sale-order');

    const onSave = async (isDraft: boolean) => {
        let moveValue: any = {};
        let productValue: any = {}
        try {
            formMoveTicket.submit();
            formProductItems?.submit();
            moveValue = await formMoveTicket.validateFields();
            productValue = await formProductItems?.validateFields();
        } catch (ex) {
            uiUtils.showCommonValidateForm();
            return;
        }

        try {
            if (!mainStore.productItems?.length) {
                uiUtils.showError('Vui lòng chọn sản phẩm');
                return;
            }

            if (mainStore.productItems.some(x => x.isProductUseLotNumber === true
                && (!x.lotNumber || !x.expiryDate))) {
                uiUtils.showError('Vui lòng chọn lô cho các sản phẩm quản lý lô');
                return;
            }
            if ((moveValue?.totalAmount || 0) - (moveValue?.paymentAmount || 0) < 0) {
                uiUtils.showError('Công nợ không được nhỏ hơn 0');
                return;
            }

            uiUtils.setBusy();
            const values: SaleOrderDto = {
                ...moveValue,
                saleOrderDeliveryDto: productValue,
                saleOrderDetails: mainStore.productItems.map((it: any) => {

                    it.discountValue = isNaN(it.discountValue) ? 0 : +it.discountValue;
                    it.id = it.id;
                    return { id: it.id, ...StockUtil.omitMoveStockItemUpsert(it, moveValue) };
                }),
            };
          
            const response = await SaleOrderService.createOrUpdate({
                body: values,
                isDraft: isDraft
            })

            if (response.isSuccessful) {
                uiUtils.showSuccess(t("saveDone"));
                navigate(-1);
            } else {
                uiUtils.showError(response.message)
            }
        } catch (ex) {
            console.error(ex)
        } finally {
            uiUtils.clearBusy();
        }
    }

    return (
        <>
            <UpsertMoveContext.Provider value={{
                formMoveTicket: formMoveTicket,
                formProductItems: formProductItems,
                editData: props.editData,
                t: t as any
            }}>
                <CrudSaleOrderForm onSave={onSave} />
            </UpsertMoveContext.Provider>
        </>

    )
        ;
}
export default observer(AddNewSaleOrder);
