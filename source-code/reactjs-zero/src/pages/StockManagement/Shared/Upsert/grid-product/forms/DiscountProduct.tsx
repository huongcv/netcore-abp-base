import {IProductIItemFormInputProp} from "@pages/StockManagement/Shared/Upsert/grid-product/forms/model";
import React, {useEffect, useState} from "react";
import {Form} from "antd";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import Utils from "@ord-core/utils/utils";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";

const DiscountProductInput = (props: IProductIItemFormInputProp) => {
    const {productItem, field, disabled} = props;
    const [maxDiscountValue, setMaxDiscountValue] = useState(0);
    const form = Form.useFormInstance();
    const discountPercent_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'discountPercent'], form);
    const discountType_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'discountType'], form);
    const discountAmountAllocation_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'discountAmountAllocation'], form);
    const totalAmountAfterDiscount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'totalAmountAfterDiscount'], form);
    const totalAmountBeforeDiscount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'totalAmountBeforeDiscount'], form);
    const discountAmount_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'discountAmount'], form);

    useEffect(() => {
        if (totalAmountBeforeDiscount_w > 0) {
            setMaxDiscountValue(totalAmountBeforeDiscount_w);
        }
    }, [totalAmountBeforeDiscount_w, discountType_w]);

    useEffect(() => {
            //Tinh tong phan tram giam gia
            const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(
                discountType_w, discountPercent_w, discountAmount_w, totalAmountBeforeDiscount_w);

            form.setFieldValue([StockMoveFormName.ProductItems,
                    field.name,
                    'totalAmountAfterDiscount'],
                (totalAmountBeforeDiscount_w || 0) - (calculateDiscount.discountAmount || 0));
        },
        [discountType_w, discountPercent_w,
            totalAmountBeforeDiscount_w,
            discountAmount_w]);

    useEffect(() => {
        const discountAmountAllocation = discountAmountAllocation_w || 0;
        const totalAmountAfterDiscount = totalAmountAfterDiscount_w || 0;
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'totalAmountBeforeTax'],
            Utils.parseFloatWithFixed((totalAmountAfterDiscount - discountAmountAllocation || 0), 2));
    }, [discountAmountAllocation_w, totalAmountAfterDiscount_w]);

    return (<>
        <Form.Item noStyle name={[field.name, 'discountPercent']}>
            {/*không cho sửa giảm giá khi sửa phiếu xuất trả ncc*/}
            <PriceNumberInput disabled={disabled}
                              className={'not-handler-wrap text-right ord-input-bottom-line'}
                              onChange={(v) => {
                                  UpsertFormUtil.inputPercentAmountChange(form, field);
                                  const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(
                                        DiscountTypeEnum.Percent, v || 0, 0, totalAmountBeforeDiscount_w);
                                  form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'discountAmount'], calculateDiscount.discountAmount);
                              }}
                              max={100}
                              min={0}
                              isOnlyNumberInput
                              decimalLimit={0}
                              addonAfter={'%'}/>
        </Form.Item>
        <Form.Item noStyle name={[field.name, 'discountAmount']}>
            {/*không cho sửa giảm giá khi sửa phiếu xuất trả ncc*/}
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