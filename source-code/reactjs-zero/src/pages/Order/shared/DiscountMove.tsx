import {Form} from "antd";
import React, {useEffect, useState} from "react";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useTranslation} from "react-i18next";
import {useDebounce} from "use-debounce";
import {round} from "lodash";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

type IDiscountMoveProps = {
    disabled?: boolean;
    onChange?: (value: number) => void;
}

const DiscountMove = (props: IDiscountMoveProps) => {
    const {disabled, onChange} = props;
    const [tCommon] = useTranslation();
    const [maxDiscountValue, setMaxDiscountValue] = useState(0);
    const form = Form.useFormInstance();
    const discountType_w = Form.useWatch('discountType', form);
    const discountValue_w = Form.useWatch('discountValue', form);
    const [totalAmountBeforeDiscount_w] = useDebounce(Form.useWatch('totalAmountBeforeDiscount', form), 150);

    useEffect(() => {
        const totalAmountBeforeDiscount = totalAmountBeforeDiscount_w ? totalAmountBeforeDiscount_w : 0;

        let discountAmount = 0;
        switch (discountType_w) {
            case DiscountTypeEnum.Value:
                form.setFieldValue('discountAmount', discountValue_w);
                form.setFieldValue('discountPercent', 0);
                discountAmount = discountValue_w ?? 0;
                break;
            case DiscountTypeEnum.Percent:
                form.setFieldValue('discountPercent', discountValue_w);
                discountAmount = round(totalAmountBeforeDiscount * (discountValue_w) / 100, 2) ?? 0;
                form.setFieldValue('discountAmount', discountAmount);
                break;
        }

        discountAmount = discountAmount ? discountAmount : 0;
        const num = (round(totalAmountBeforeDiscount || 0, 2) || 0) - (round(discountAmount || 0, 2) || 0);
        form.setFieldValue('totalAmountAfterDiscount', num);
        form.setFieldValue('totalAmountBeforeTax', num);
    }, [discountType_w,
        discountValue_w,
        totalAmountBeforeDiscount_w]);

    useEffect(() => {
        if (discountType_w == DiscountTypeEnum.Percent) {
            setMaxDiscountValue(100);
        } else if (totalAmountBeforeDiscount_w > 0) {
            setMaxDiscountValue(totalAmountBeforeDiscount_w);
        }
    }, [totalAmountBeforeDiscount_w, discountType_w]);
    return (
        <>
            <Form.Item noStyle name={'discountValue'}>
                <PriceNumberInput className={'not-handler-wrap text-right'}
                                  max={maxDiscountValue}
                                  onChange={(e: any) => {
                                      onChange && onChange(e);
                                  }}
                                  min={0}
                                  disabled={props?.disabled}
                                  decimalLimit={0}
                                  isOnlyNumberInput={true}
                                  addonAfter={(discountType_w === DiscountTypeEnum.Value ? tCommon('basicCurrency') : '%')}/>
            </Form.Item>
            <p hidden>
                <Form.Item noStyle name={'discountAmount'}/>
                <Form.Item noStyle name={'discountPercent'}/>
                <Form.Item noStyle name={'totalAmountAfterDiscount'}/>
                <Form.Item noStyle name={'totalAmountBeforeTax'}/>
            </p>
        </>

    );
}
export default DiscountMove;