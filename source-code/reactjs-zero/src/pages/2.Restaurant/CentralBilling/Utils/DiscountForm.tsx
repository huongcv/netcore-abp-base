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
import {round} from "lodash";

export const DiscountForm = () => {
    const {t} = useTranslation('sale-invoice')
    const form = Form.useFormInstance(); 
    const totalAmountBeforeDiscount_w = Form.useWatch('totalAmountBeforeDiscount', form);

    const {entityModalStore} = useStore();

    const clickAdd = () => {

        entityModalStore.openModalForm({
            entity: {},
            modal: {
                title: t("discountInputPlaceholder"),
            },
            formContent: () => <FormDiscountInModal  formOut={form}
                                                    totalAmountBeforeDiscount={totalAmountBeforeDiscount_w}/>,
            onSave: async (saveData) => {
                // UiUtils.setBusy();
                form.setFieldsValue(saveData);
                return true;
            },
            onClose: () => {
            },
        });
    };
    const discountAmount_w = Form.useWatch('discountAmount', form);
    return (<>
        <Form.Item name="discountInput" hidden noStyle>
        </Form.Item>
        <Form.Item name="discountType" hidden noStyle>
        </Form.Item>
        <Form.Item name="discountPercent" hidden noStyle>
        </Form.Item>
        <Form.Item name="discountAmount" noStyle hidden>
        </Form.Item>
        <Form.Item name="taxDiscountCode" hidden noStyle>
        </Form.Item>
        <Form.Item name="taxDiscountPercent" hidden noStyle>
        </Form.Item>
        <Form.Item name="taxDiscountAmount" hidden noStyle>
        </Form.Item>
        <div className="flex justify-between text-md items-center  h-[33px] ">
            <div>
                Chiết khấu
            </div>
            <span className='border-b-[1px] border-dashed border-[#cccdcd] min-w-32 text-right cursor-pointer' onClick={clickAdd}>
                {Utils.formatterNumber(discountAmount_w, 2)} {currencyDefault}
            </span>
        </div>
    </>)
}
const FormDiscountInModal = (props: {
    formOut: FormInstance,
    totalAmountBeforeDiscount: number,
    disabled?: boolean
}) => {
    const {t} = useTranslation('sale-invoice')
    const form = Form.useFormInstance();
    useEffect(() => {
        if (props.formOut) {
            const values = props.formOut.getFieldsValue(true);
            form.setFieldsValue(values);
        }
    }, [props.formOut]);
    const sourceDiscountType = {
        data: [
            {
                value: 1,
                label: "Giảm giá trị",
            },
            {
                value: 2,
                label: "Giảm phần trăm",
            }
        ],
        isPending: false
    } as SelectDataSource
    const discountType_w = Form.useWatch('discountType', form);
    const discountAmount_w = Form.useWatch('discountAmount', form);
    const discountInputChange = () => {
        const discountInputVal = form.getFieldValue('discountInput') || 0;
        const taxDiscountPercent = form.getFieldValue('taxDiscountPercent') || 0;
        const type = form.getFieldValue('discountType') || 2;
        if (type === 2) {
            let newValue = props.totalAmountBeforeDiscount * parseFloat(discountInputVal) / 100;
            const taxDiscountAmount = newValue * taxDiscountPercent / 100;

            form.setFieldsValue({
                discountPercent: discountInputVal,
                discountAmount: round(newValue, 2),
                discountType: 2,
                taxDiscountAmount: taxDiscountAmount
            })
        } else {
            const taxDiscountAmount = discountInputVal * taxDiscountPercent / 100;

            form.setFieldsValue({
                discountPercent: 0,
                discountAmount: discountInputVal,
                taxDiscountAmount: round(taxDiscountAmount, 2)
            })
        }
    }

    const taxDiscountPercentChange = (taxDiscountPercent: number) => {
        const taxDiscountAmount = (discountAmount_w ?? 0) * (taxDiscountPercent ?? 0) / 100;
        form.setFieldsValue({
            taxDiscountAmount: round(taxDiscountAmount, 2)
        })
    }

    return <>
        <FloatLabel label={t("discountType")}>
            <Form.Item name="discountType" initialValue={2}>
                <OrdSelect disabled={props.disabled} datasource={sourceDiscountType}></OrdSelect>
            </Form.Item>
        </FloatLabel>
        <FloatLabel label={discountType_w == 1 ? ("Tiền chiết khấu") : "Nhập phần trăm (%)"}>
            <Form.Item name="discountInput">
                <PriceNumberInput onChange={discountInputChange}
                                  step={1000} min={0}
                                  style={{width: "100%"}}
                                  disabled={props.disabled}
                                  max={discountType_w == 1 ? props.totalAmountBeforeDiscount : 100}/>
            </Form.Item>
        </FloatLabel>
        <Form.Item name="discountPercent" hidden>
            <Input/>
        </Form.Item>
        <div hidden={discountType_w == 1}>
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
            </Form.Item>
            <FloatLabel label='Tiền thuế chiết khấu'>
                <Form.Item name="taxDiscountAmount">
                    <Input disabled/>
                </Form.Item>
            </FloatLabel>

        </div>


    </>
}
