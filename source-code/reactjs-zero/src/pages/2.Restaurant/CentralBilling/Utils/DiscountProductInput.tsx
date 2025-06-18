import React, {useEffect, useState} from "react";
import {Form} from "antd";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import Utils from "@ord-core/utils/utils";
import {IProductIItemFormInputProp} from "../types/type";
import {UpsertFormUtil} from "./utils";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";

const DiscountProductInput = (props: IProductIItemFormInputProp) => {
    const {productItem, field, disabled} = props;
    const [maxDiscountValue, setMaxDiscountValue] = useState(0);
    const form = Form.useFormInstance();
    const discountPercent_w = Form.useWatch(["saleInvoiceDetails", field.name, 'discountPercent'], form);
    const discountType_w = Form.useWatch(["saleInvoiceDetails", field.name, 'discountType'], form);
    const discountAmountAllocation_w = Form.useWatch(["saleInvoiceDetails", field.name, 'discountAmountAllocation'], form);
    const totalAmountAfterDiscount_w = Form.useWatch(["saleInvoiceDetails", field.name, 'totalAmountAfterDiscount'], form);
    const totalAmountBeforeDiscount_w = Form.useWatch(["saleInvoiceDetails", field.name, 'totalAmountBeforeDiscount'], form);
    const discountAmount_w = Form.useWatch(["saleInvoiceDetails", field.name, 'discountAmount'], form);

    useEffect(() => {
        if (totalAmountBeforeDiscount_w > 0) {
            setMaxDiscountValue(totalAmountBeforeDiscount_w);
        }
    }, [totalAmountBeforeDiscount_w, discountType_w]);

    useEffect(() => {
            const discountAmount =
                UpsertFormUtil.calculatorDiscountAmount(discountType_w, discountAmount_w, discountPercent_w,
                    totalAmountBeforeDiscount_w);
            form.setFieldValue(["saleInvoiceDetails",
                    field.name,
                    'totalAmountAfterDiscount'],
                (totalAmountBeforeDiscount_w || 0) - (discountAmount || 0));
        },
        [discountType_w, discountPercent_w,
            totalAmountBeforeDiscount_w,
            discountAmount_w]);

    useEffect(() => {
        const discountAmountAllocation = discountAmountAllocation_w || 0;
        const totalAmountAfterDiscount = totalAmountAfterDiscount_w || 0;
        form.setFieldValue(["saleInvoiceDetails", field.name, 'totalAmountBeforeTax'],
            Utils.parseFloatWithFixed((totalAmountAfterDiscount - discountAmountAllocation || 0), 2));
    }, [discountAmountAllocation_w, totalAmountAfterDiscount_w]);

    return (<>
        <Form.Item noStyle name={[field.name, 'discountPercent']}>
            <PriceNumberInput disabled={disabled}
                              className={'not-handler-wrap text-right ord-input-bottom-line'}
                              onChange={(v) => {
                                  UpsertFormUtil.inputPercentAmountChange(form, field);
                                  const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(DiscountTypeEnum.Percent, v || 0, 0, totalAmountBeforeDiscount_w);
                                  form.setFieldValue(["saleInvoiceDetails", field.name, 'discountAmount'], calculateDiscount.discountAmount);
                              }}
                              max={100}
                              min={0}
                              isOnlyNumberInput
                              decimalLimit={0}
                              addonAfter={'%'}/>
        </Form.Item>
        <Form.Item noStyle name={[field.name, 'discountAmount']}>
            <PriceNumberInput disabled={disabled}
                              className={'not-handler-wrap text-right ord-input-bottom-line'}
                              onChange={(v) => {
                                  UpsertFormUtil.inputDiscountAmountChange(form, field);
                              }}
                              max={maxDiscountValue}
                              min={0}
                              decimalLimit={2}
                              addonAfter={'VNĐ'}/>
        </Form.Item>
        <p hidden>
            <Form.Item noStyle name={[field.name, 'discountType']} initialValue={DiscountTypeEnum.Percent}/>
            <Form.Item noStyle name={[field.name, 'discountAmountAllocation']}/>
            <Form.Item noStyle name={[field.name, 'totalAmountBeforeTax']}/>
        </p>
    </>);
}
export default DiscountProductInput;