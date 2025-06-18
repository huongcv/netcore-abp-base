import {Form} from "antd";
import {useEffect, useRef} from "react";
import Utils from "@ord-core/utils/utils";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import NumberUtil from "@ord-core/utils/number.util";
import {SaleInvoiceDetailDto} from "@api/index.defs";
import {
    extraService,
    serviceUsingFieldName
} from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/fieldConst";
import {sumBy} from "lodash";


const withPricePaymentBookingGroupInfo = (WrappedComponent: any) => {
    return (props: {}) => {
        // const {formProductItems} = props;
        const formMoveTicket = Form.useFormInstance();
        const items_w = Form.useWatch(serviceUsingFieldName, formMoveTicket);
        const itemsExtra_w = Form.useWatch(extraService, formMoveTicket);
        const totalAmountBeforeDiscount_w = Form.useWatch('totalAmountBeforeDiscount', formMoveTicket);
        const discountAmountMove_w = Form.useWatch('discountAmount', formMoveTicket);
        const totalAmountBeforeTax_w = Form.useWatch('totalAmountBeforeTax', formMoveTicket);
        const taxAmount_w = Form.useWatch('taxAmount', formMoveTicket);
        const taxDiscountPercent_w = Form.useWatch('taxDiscountPercent', formMoveTicket);
        const totalAmount_w = Form.useWatch('totalAmount', formMoveTicket);
        const totalAmountRound_w = Form.useWatch('totalAmountRound', formMoveTicket);
        const paymentAmount_w = Form.useWatch('paymentAmount', formMoveTicket);
        const discountValue_w = Form.useWatch('discountValue', formMoveTicket);
        const discountType_w = Form.useWatch('discountType', formMoveTicket);
        const totalAmountAfterDiscount_w = Form.useWatch('totalAmountAfterDiscount', formMoveTicket);

        const dirtyRef = useRef<boolean>(false)


        useEffect(() => {
            const itemsDefault: SaleInvoiceDetailDto[] = items_w || [];
            const itemsExtra: SaleInvoiceDetailDto[] = itemsExtra_w || [];
            const items = itemsDefault.concat(itemsExtra);

            const totalAmountBeforeDiscount = sumBy(items, f=>f.totalAmountAfterDiscount??0);
            const taxAmount = sumBy(items, f=>f.taxAmount??0);
            if (totalAmountBeforeDiscount != formMoveTicket.getFieldValue('totalAmountBeforeDiscount')) {
                formMoveTicket.setFieldValue('totalAmountBeforeDiscount', Utils.parseFloatWithFixed(totalAmountBeforeDiscount, 2));
            }
            if (taxAmount != formMoveTicket.getFieldValue('taxAmount')) {
                formMoveTicket.setFieldValue('taxAmount', Utils.parseFloatWithFixed(taxAmount, 2));
            }

        }, [items_w, itemsExtra_w]);

        useEffect(() => {
            // tam lam vay Xu lý sau chỗ này đang sai
            const total = totalAmountAfterDiscount_w + taxAmount_w;
            formMoveTicket.setFieldValue('totalAmount', Utils.parseFloatWithFixed(total, 2));
            const totalAmountRound = NumberUtil.ceil(total);
            formMoveTicket.setFieldValue('totalAmountRound', totalAmountRound);

        }, [totalAmountAfterDiscount_w]);


        useEffect(() => {
            // if (dirtyRef.current) {
            const paymentAmount = paymentAmount_w ?? 0;
            // const totalAmountRound = totalAmountRound_w ?? 0;
            let debtAmount = totalAmount_w - paymentAmount;
            debtAmount = debtAmount < 0 ? 0 : debtAmount;
            formMoveTicket.setFieldValue('debtAmount', NumberUtil.ceil(debtAmount ?? 0));
            // }

        }, [totalAmount_w, paymentAmount_w]);

        return <WrappedComponent {...props} />;
    };
};

export default withPricePaymentBookingGroupInfo;
