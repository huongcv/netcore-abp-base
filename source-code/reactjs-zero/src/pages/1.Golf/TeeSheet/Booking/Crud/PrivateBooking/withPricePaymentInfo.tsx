import {Form} from "antd";
import {useEffect, useRef} from "react";
import Utils from "@ord-core/utils/utils";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import NumberUtil from "@ord-core/utils/number.util";
import {SaleInvoiceDetailDto} from "@api/index.defs";
import {serviceUsingFieldName} from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/serviceUsing/fieldConst";

// export interface IStockInventoryPriceAmountDto {
//     price?: number;
//     qty?: number;
//     totalAmountBeforeDiscount?: number;
//     discountAmount?: number;
//     totalAmountAfterDiscount?: number;
//     discountAmountAllocation?: number;
//     totalAmountBeforeTax?: number;
//     taxAmount?: number;
//     subTaxAmount?: number;
//     taxDiscountAmountAllocation?: number;
//     discountPercent?: number;
//     discountType?: DiscountType;
//     taxPercent?: number;
// }

declare var ord: any;

const withPricePaymentInfo = (WrappedComponent: any) => {
    return (props: {}) => {
        // const {formProductItems} = props;
        const formMoveTicket = Form.useFormInstance();
        const items_w = Form.useWatch(serviceUsingFieldName, formMoveTicket);
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

        ord.event.on('event@dirty.stock', (value: boolean) => {
            dirtyRef.current = value;
        });

        //Tính giảm giá phân bổ cho sản phẩm
        useEffect(() => {
            // const discountAmountMove = UpsertFormUtil.calculatorDiscountAmount(discountType_w, discountValue_w, totalAmountBeforeDiscount_w);
            // const productItems: IStockInventoryPriceAmountDto[] = formProductItems.getFieldValue(StockMoveFormName.ProductItems) || [];
            // if (productItems && productItems.length > 0) {
            //     let idx = 0;
            //     let totalAfterDiscountItems = 0;
            //     productItems.forEach(it => {
            //         totalAfterDiscountItems += (it.totalAmountAfterDiscount || 0)
            //     });
            //     let amountAllocation = 0;
            //     productItems.forEach(it => {
            //         if ((idx + 1) === productItems.length) {
            //             const amountAllocationFinal = (discountAmountMove - amountAllocation) || 0;
            //             formProductItems.setFieldValue([StockMoveFormName.ProductItems, '' + idx, 'discountAmountAllocation'], amountAllocationFinal);
            //
            //             const totalAmountBeforeTax = (it.totalAmountAfterDiscount || 0) - amountAllocationFinal;
            //             formProductItems.setFieldValue([StockMoveFormName.ProductItems, '' + idx, 'totalAmountBeforeTax'], totalAmountBeforeTax);
            //             return;
            //         }
            //         if (discountAmountMove == 0 || totalAfterDiscountItems == 0) {
            //             formProductItems.setFieldValue([StockMoveFormName.ProductItems, '' + idx, 'discountAmountAllocation'], 0);
            //         } else {
            //             const percentAllocation = (it.totalAmountAfterDiscount || 0) / totalAfterDiscountItems;
            //             const discountAmountAllocation = Utils.parseFloatWithFixed(percentAllocation * discountAmountMove, 2) || 0;
            //             formProductItems.setFieldValue([StockMoveFormName.ProductItems, '' + idx, 'discountAmountAllocation'], discountAmountAllocation);
            //
            //             const totalAmountBeforeTax = (it.totalAmountAfterDiscount || 0) - discountAmountAllocation;
            //             formProductItems.setFieldValue([StockMoveFormName.ProductItems, '' + idx, 'totalAmountBeforeTax'], totalAmountBeforeTax);
            //
            //             amountAllocation = amountAllocation + (discountAmountAllocation || 0);
            //         }
            //
            //         idx++;
            //     });
            // }
        }, [discountAmountMove_w, totalAmountBeforeDiscount_w, discountValue_w]);

        useEffect(() => {
            //tong chiet khau cua phieu
            const discountAmountMove = UpsertFormUtil.calculatorDiscountAmount(discountType_w, discountValue_w, totalAmountBeforeDiscount_w);
            //thue chiet khau cua phieu
            const taxDiscountAmount = Utils.parseFloatWithFixed((discountAmountMove || 0) * (taxDiscountPercent_w || 0) / 100, 2) || 0;

            const items: SaleInvoiceDetailDto[] = formMoveTicket.getFieldValue(serviceUsingFieldName) || [];
            let totalAmountBeforeDiscount = 0;
            let taxAmount = 0;
            let amountAllocation = 0;

            items.forEach((it, index) => {
                if (it.totalAmountAfterDiscount && it.totalAmountAfterDiscount > 0) {
                    totalAmountBeforeDiscount += it.totalAmountAfterDiscount;
                }

                if (it.taxAmount && it.taxAmount > 0) {
                    taxAmount += it.taxAmount;
                }
            });

            if (totalAmountBeforeDiscount != formMoveTicket.getFieldValue('totalAmountBeforeDiscount')) {
                formMoveTicket.setFieldValue('totalAmountBeforeDiscount', Utils.parseFloatWithFixed(totalAmountBeforeDiscount, 2));
            }

            if (taxAmount != formMoveTicket.getFieldValue('taxAmount')) {
                formMoveTicket.setFieldValue('taxAmount', Utils.parseFloatWithFixed(taxAmount, 2));
            }

        }, [items_w, taxDiscountPercent_w, discountValue_w]);

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

export default withPricePaymentInfo;
