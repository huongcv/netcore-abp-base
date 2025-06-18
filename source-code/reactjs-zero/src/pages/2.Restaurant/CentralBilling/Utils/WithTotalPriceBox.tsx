import Utils from "@ord-core/utils/utils";
import {Form} from "antd";
import {useEffect, useRef} from "react";
import {IRightBoxProp} from "../types/type";
import {calculatorDiscountAmount} from "./WithPriceDiscountTaxFull";
import {UpsertFormUtil} from "./utils";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

export interface IPriceAmountDto {
    price?: number;
    qty?: number;
    totalAmountBeforeDiscount?: number;
    discountAmount?: number;
    totalAmountAfterDiscount?: number;
    discountAmountAllocation?: number;
    totalAmountBeforeTax?: number;
    taxAmount?: number;
    discountPercent?: number;
    discountType?: DiscountTypeEnum;
    taxPercent?: number;
}

declare var ord: any;

const withTotalPriceBox = (WrappedComponent: any) => {
    return (props: IRightBoxProp) => {
        const {formProductItems} = props;
        const form = Form.useFormInstance();
        const items_w = Form.useWatch('saleInvoiceDetails', formProductItems);
        const totalAmountBeforeDiscount_w = Form.useWatch('totalAmountBeforeDiscount', form);
        const discountAmount_w = Form.useWatch('discountAmount', form);
        const discountPercent_w = Form.useWatch('discountPercent', form);
        const totalAmountBeforeTax_w = Form.useWatch('totalAmountBeforeTax', form);
        const taxAmount_w = Form.useWatch('taxAmount', form);
        const totalAmount_w = Form.useWatch('totalAmount', form);
        const paymentAmount_w = Form.useWatch('paymentAmount', form);
        const discountType_w = Form.useWatch('discountType', form);
        const dirtyRef = useRef<boolean>(false)
        const fetchData_w = Form.useWatch('fetchData', form);

        ord.event.on('event@dirty.stock', (value: boolean) => {
            dirtyRef.current = value;
        });

        useEffect(() => {
            if (!fetchData_w) return;
            const discountAmount = UpsertFormUtil.calculatorDiscountAmount(discountType_w, discountAmount_w, discountPercent_w, totalAmountBeforeDiscount_w);
            const productItems: IPriceAmountDto[] = formProductItems.getFieldValue('saleInvoiceDetails') || [];
            if (productItems && productItems.length > 0) {
                let idx = 0;
                let totalAfterDiscountItems = 0;
                productItems.forEach(it => {
                    totalAfterDiscountItems += (it.totalAmountAfterDiscount || 0)
                });
                let amountAllocation = 0;
                productItems.forEach(it => {
                    if ((idx + 1) === productItems.length) {
                        const amountAllocationFinal = (discountAmount - amountAllocation) || 0;
                        formProductItems.setFieldValue(['saleInvoiceDetails', '' + idx, 'discountAmountAllocation'], amountAllocationFinal);

                        const totalAmountBeforeTax = (it.totalAmountAfterDiscount || 0) - amountAllocationFinal;
                        formProductItems.setFieldValue(['saleInvoiceDetails', '' + idx, 'totalAmountBeforeTax'], totalAmountBeforeTax);
                        return;
                    }
                    if (discountAmount == 0 || totalAfterDiscountItems == 0) {
                        formProductItems.setFieldValue(['saleInvoiceDetails', '' + idx, 'discountAmountAllocation'], 0);
                    } else {
                        const percentAllocation = (it.totalAmountAfterDiscount || 0) / totalAfterDiscountItems;
                        const discountAmountAllocation = Utils.parseFloatWithFixed(percentAllocation * discountAmount, 2) || 0;
                        formProductItems.setFieldValue(['saleInvoiceDetails', '' + idx, 'discountAmountAllocation'], discountAmountAllocation);

                        const totalAmountBeforeTax = (it.totalAmountAfterDiscount || 0) - discountAmountAllocation;
                        formProductItems.setFieldValue(['saleInvoiceDetails', '' + idx, 'totalAmountBeforeTax'], totalAmountBeforeTax);

                        amountAllocation = amountAllocation + (discountAmountAllocation || 0);
                    }

                    idx++;
                });
            }
        }, [discountAmount_w, totalAmountBeforeDiscount_w, discountAmount_w, fetchData_w]);

        useEffect(() => {
            if (!fetchData_w) return;

            const items: IPriceAmountDto[] = formProductItems.getFieldValue('saleInvoiceDetails') || [];
            let totalAmountBeforeDiscount = 0;
            let taxAmount = 0;

            items.forEach((it, index) => {
                if (it.discountType === DiscountTypeEnum.Percent) {
                    it.discountAmount = calculatorDiscountAmount(it.discountType, it.discountPercent, it.totalAmountBeforeDiscount)
                    formProductItems.setFieldValue(['saleInvoiceDetails', index + '', 'discountAmount'], it.discountAmount);
                } else if ((it.discountAmount || 0) > (it.totalAmountBeforeDiscount || 0)) {
                    it.discountAmount = it.totalAmountBeforeDiscount;
                    formProductItems.setFieldValue(['saleInvoiceDetails', index + '', 'discountAmount'], it.discountAmount);
                }

                const taxAmountItem = Utils.parseFloatWithFixed((it.totalAmountAfterDiscount, 0) * (it.taxPercent, 0) / 100, 2) ?? 0;
                formProductItems.setFieldValue(['saleInvoiceDetails', index + '', 'taxAmount'], taxAmountItem);

                const totalAmount = (it.totalAmountBeforeTax || 0) + taxAmountItem;
                formProductItems.setFieldValue(['saleInvoiceDetails', index + '', 'totalAmount'], Utils.parseFloatWithFixed(totalAmount > 0 ? totalAmount : 0, 2));

                if (it.totalAmountAfterDiscount && it.totalAmountAfterDiscount > 0) {
                    totalAmountBeforeDiscount += it.totalAmountAfterDiscount;
                }

                if (it.taxAmount && it.taxAmount > 0) {
                    taxAmount += it.taxAmount;
                }

            });
            if (totalAmountBeforeDiscount != form.getFieldValue('totalAmountBeforeDiscount')) {
                form.setFieldValue('totalAmountBeforeDiscount', Utils.parseFloatWithFixed(totalAmountBeforeDiscount, 2));
            }
            if (taxAmount != form.getFieldValue('taxAmount')) {
                form.setFieldValue('taxAmount', Utils.parseFloatWithFixed(taxAmount, 2));
            }

        }, [items_w, discountAmount_w, fetchData_w]);

        useEffect(() => {
            if (!fetchData_w) return;
            const items = formProductItems.getFieldValue('saleInvoiceDetails') || [];
            const totalAmount = items?.reduce((total: number, x: any) => total + x.totalAmount || 0, 0) || 0;
            form.setFieldValue('totalAmount', Utils.parseFloatWithFixed(totalAmount, 2));

            form.setFieldValue('paymentAmount', totalAmount);
            form.setFieldValue('debtAmount', 0);
        }, [totalAmountBeforeTax_w, taxAmount_w, discountAmount_w, fetchData_w, totalAmountBeforeDiscount_w]);

        useEffect(() => {
            const paymentAmount = paymentAmount_w ?? 0;
            const totalAmountRound = totalAmount_w ?? 0;
            let debtAmount = totalAmountRound - paymentAmount;
            debtAmount = debtAmount < 0 ? 0 : debtAmount;
            form.setFieldValue('debtAmount', debtAmount ?? 0);
        }, [totalAmount_w, paymentAmount_w, fetchData_w]);

        return <WrappedComponent {...props} />;
    };
};

export default withTotalPriceBox;
