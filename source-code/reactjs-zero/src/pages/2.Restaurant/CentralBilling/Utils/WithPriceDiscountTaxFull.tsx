import Utils from "@ord-core/utils/utils";
import {Form, FormInstance, FormListFieldData} from "antd";
import {useEffect} from "react";
import {ProductItemFormProps} from "../types/type";
import {round} from "lodash";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

export const calculatorDiscountAmount = (type: DiscountTypeEnum, value?: number, totalAmountBeforeDiscount?: number) => {
    if (type === DiscountTypeEnum.Percent) {
        return Utils.parseFloatWithFixed((value || 0) * (totalAmountBeforeDiscount || 0) / 100, 2) || 0;
    }

    return value || 0;
}

export const inputDiscountAmountChange = (form: FormInstance, field: FormListFieldData) => {
    form.setFieldValue(['saleInvoiceDetails', field.name, 'DiscountTypeEnum'], DiscountTypeEnum.Value);
    form.setFieldValue(['saleInvoiceDetails', field.name, 'discountPercent'], 0);
}

export const inputPercentAmountChange = (form: FormInstance, field: FormListFieldData) => {
    form.setFieldValue(['saleInvoiceDetails', field.name, 'DiscountTypeEnum'], DiscountTypeEnum.Percent);
}

const withPriceDiscountTaxFull = (WrappedComponent: any) => {
    return (props: ProductItemFormProps) => {
        const {field, formInfo} = props;
        const form = Form.useFormInstance();
        const price_w = Form.useWatch(['saleInvoiceDetails', field.name, 'price'], form);
        const qty_w = Form.useWatch(['saleInvoiceDetails', field.name, 'qty'], form);

        const discountType_w = Form.useWatch(['saleInvoiceDetails', field.name, 'DiscountTypeEnum'], form);
        const discountAmount_w = Form.useWatch(['saleInvoiceDetails', field.name, 'discountAmount'], form);
        const discountPercent_w = Form.useWatch(['saleInvoiceDetails', field.name, 'discountPercent'], form);
        const taxPercent_w = Form.useWatch(['saleInvoiceDetails', field.name, 'taxPercent'], form);
        const taxDiscountPercent_w = Form.useWatch('taxDiscountPercent', formInfo);
        const fetchData_w = Form.useWatch('fetchData', formInfo);


        useEffect(() => {
            if (!fetchData_w) return;
            const totalAmountBeforeDiscount = (price_w || 0) * (qty_w || 0);
            form.setFieldValue(['saleInvoiceDetails', field.name, 'totalAmountBeforeDiscount'], Utils.parseFloatWithFixed(totalAmountBeforeDiscount || 0, 2));

            let discountAmount: number = 0;

            switch (discountType_w) {
                case DiscountTypeEnum.Value:
                    discountAmount =
                        calculatorDiscountAmount(discountType_w, discountAmount_w,
                            totalAmountBeforeDiscount);

                    inputDiscountAmountChange(form, field)

                    break;
                case DiscountTypeEnum.Percent:
                    discountAmount =
                        calculatorDiscountAmount(discountType_w, discountPercent_w,
                            totalAmountBeforeDiscount);

                    inputPercentAmountChange(form, field)
                    break;
            }

            const totalAmountAfterDiscount = (Utils.parseFloatWithFixed(totalAmountBeforeDiscount, 2) || 0) - (Utils.parseFloatWithFixed(discountAmount, 2) || 0);
            form.setFieldValue(['saleInvoiceDetails',
                    field.name,
                    'totalAmountAfterDiscount'],
                totalAmountAfterDiscount);
            form.setFieldValue(['saleInvoiceDetails',
                    field.name,
                    'totalAmountAfterDiscount'],
                totalAmountAfterDiscount);

            const subTaxAmount = (totalAmountAfterDiscount * (taxPercent_w || 0) / 100) || 0;
            form.setFieldValue(['saleInvoiceDetails',
                    field.name,
                    'subTaxAmount'],
                subTaxAmount);

            const subTotalAmount = round(totalAmountAfterDiscount + subTaxAmount, 0);
            form.setFieldValue(['saleInvoiceDetails',
                    field.name,
                    'subTotalAmount'],
                subTotalAmount);

        }, [price_w, qty_w, taxDiscountPercent_w, fetchData_w]);

        return <>
            <WrappedComponent {...props} />
        </>;
    };
};


export default withPriceDiscountTaxFull;
