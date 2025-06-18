import {Form, FormInstance, Input} from "antd";
import * as React from "react";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {currencyDefault, TaxCodeNotUse} from "@ord-core/AppConst";
import {useStore} from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";

const sourceDiscountType = {
    data: [
        {
            value: DiscountTypeEnum.Value,
            label: "Giảm giá trị",
        },
        {
            value: DiscountTypeEnum.Percent,
            label: "Giảm phần trăm",
        }
    ],
    isPending: false
} as SelectDataSource

export const DiscountForm = (props: { form: FormInstance, disabled?: boolean }) => {
    const {t} = useTranslation('sale-invoice')
    const {entityModalStore} = useStore();

    const {form, disabled} = props;
    const totalAmountBeforeDiscount_w = Form.useWatch('totalAmountBeforeDiscount', form);
    const discountAmount_w = Form.useWatch('discountAmount', form);
    const isGroupDiscountPercent_w = Form.useWatch('isGroupDiscountPercent', form);
    const groupDiscountPercent_w = Form.useWatch('groupDiscountPercent', form);

    useEffect(() => {
        form.setFieldValue('discountInput', "");
    }, []);

    const clickAdd = () => {
        entityModalStore.openModalForm({
            entity: {},
            modal: {title: t("discountInputPlaceholder")},
            formContent: () => <FormDiscountInModal disabled={disabled} formOut={form}
                                                    totalAmountBeforeDiscount={totalAmountBeforeDiscount_w || 0}/>,
            onSave: async (saveData) => {
                form.setFieldsValue(saveData);
                form.setFieldValue('isGroupDiscountPercent', false);
                form.setFieldValue('groupDiscountPercent', 0);
                return true;
            },
            onClose: () => {
            },
        });
    };

    return (<>
        <div className="flex justify-between text-md items-center h-[33px] cursor-pointer" onClick={clickAdd}>
            <div> Chiết khấu</div>
            <span className='border-b-[1px] border-dashed border-[#cccdcd] min-w-32 text-right'>
                {Utils.formatterNumber(discountAmount_w, 2)} {currencyDefault}
            </span>
        </div>

        {
            isGroupDiscountPercent_w &&
            <div className='italic text-sm'>
                (Khách hàng này được chiết khấu {groupDiscountPercent_w}%)
            </div>
        }

        <div hidden>
            <Form.Item name="discountInput"/>
            <Form.Item name="discountType"/>
            <Form.Item name="discountPercent"/>
            <Form.Item name="discountAmount"/>
            <Form.Item name="taxDiscountCode"/>
            <Form.Item name="taxDiscountPercent"/>
            <Form.Item name="taxDiscountAmount"/>
            <Form.Item name="isGroupDiscountPercent" initialValue={false}/>
            <Form.Item name="groupDiscountPercent"/>
        </div>
    </>)
}
const FormDiscountInModal = (props: {
    formOut: FormInstance,
    totalAmountBeforeDiscount: number,
    disabled?: boolean
}) => {
    const {t} = useTranslation('sale-invoice')
    const {formOut, totalAmountBeforeDiscount, disabled} = props;
    const form = Form.useFormInstance();
    const discountType_w = Form.useWatch('discountType', form);
    const discountAmount_w = Form.useWatch('discountAmount', form);

    useEffect(() => {
        if (formOut) {
            const values = formOut.getFieldsValue(true); // true để lấy tất cả fields
            form.setFieldsValue(values);
        }
    }, [formOut]);

    const discountInputChange = () => {
        const values = form.getFieldsValue();
        const taxDiscountPercent = values.taxDiscountPercent || 0;
        const type = values.discountType || DiscountTypeEnum.Percent;

        const discountAmount = type === DiscountTypeEnum.Value ? values.discountInput : 0;
        const discountPercent = type === DiscountTypeEnum.Percent ? values.discountInput : 0;

        const calculatorDiscount =
            CalculatorCurrencyUtil.calculateDiscount(type, discountPercent, discountAmount, totalAmountBeforeDiscount);
        const taxDiscountAmount =
            CalculatorCurrencyUtil.summaryTaxDiscountAmount(calculatorDiscount.discountAmount, taxDiscountPercent);

        form.setFieldsValue({
            discountPercent: calculatorDiscount.discountPercent,
            discountAmount: calculatorDiscount.discountAmount,
            discountType: type,
            taxDiscountAmount: taxDiscountAmount
        })
    }

    const taxDiscountPercentChange = (taxDiscountPercent: number) => {
        const taxDiscountAmount = CalculatorCurrencyUtil.summaryTaxDiscountAmount(discountAmount_w, taxDiscountPercent);

        form.setFieldsValue({
            taxDiscountAmount: taxDiscountAmount
        })
    }

    return <>
        <FloatLabel label={t("discountType")}>
            <Form.Item name="discountType" initialValue={DiscountTypeEnum.Percent}>
                <OrdSelect disabled={disabled} datasource={sourceDiscountType}></OrdSelect>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={discountType_w == DiscountTypeEnum.Value ? ("Tiền chiết khấu") : "Nhập phần trăm (%)"}>
            <Form.Item name="discountInput">
                <PriceNumberInput onChange={discountInputChange}
                                  step={1000} min={0}
                                  style={{width: "100%"}}
                                  disabled={disabled}
                                  max={discountType_w == DiscountTypeEnum.Value ? totalAmountBeforeDiscount : 100}/>
            </Form.Item>
        </FloatLabel>
        <Form.Item name="discountPercent" hidden>
            <Input/>
        </Form.Item>
        <div hidden={discountType_w == DiscountTypeEnum.Value}>
            <FloatLabel label={t("discountAmount")}>
                <Form.Item name="discountAmount">
                    <PriceNumberInput step={1000} disabled min={0}/>
                </Form.Item>
            </FloatLabel>
        </div>

        <div hidden={discountAmount_w <= 0}>
            <FloatLabel label={'Thuế chiết khấu (%)'}>
                <Form.Item name="taxDiscountCode" initialValue={TaxCodeNotUse}>
                    <OrdSelect allowClear={false}
                               onChange={(data, option: IOrdSelectOption) => {
                                   form.setFieldValue("taxDiscountPercent", option.data?.taxPercent);
                                   taxDiscountPercentChange(option?.data?.taxPercent ?? 0)

                               }}
                               disabled={props.disabled}
                               datasource={useSelectTaxCode()}/>
                </Form.Item>
            </FloatLabel>

            <Form.Item name="taxDiscountPercent" noStyle hidden>
                {/*<OrdSelect onChange={taxDiscountPercentChange} datasource={useSelectTaxPercent()}></OrdSelect>*/}
            </Form.Item>
            <FloatLabel label='Tiền thuế chiết khấu'>
                <Form.Item name="taxDiscountAmount">
                    <Input disabled/>
                </Form.Item>
            </FloatLabel>
        </div>
    </>
}
