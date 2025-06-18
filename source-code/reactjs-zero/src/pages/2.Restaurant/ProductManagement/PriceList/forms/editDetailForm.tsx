import { CloseOutlined, MinusOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { ProductPriceListDetailDto, ProductPriceListDto } from "@api/index.defs";
import { ProductPriceListDetailService } from "@api/ProductPriceListDetailService";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import {
    CalculateUsePrice
} from "@ord-components/forms/select/selectDataSource/useSelectPriceListCalculate";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { Button, Checkbox, Flex, Form, Input, Select, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CALCULATE_PRICE_METHOD } from "./priceListDetailFormSearch";

enum METHOD_TYPE {
    VALUE = 1,
    CACULATOR = 2,
}

export const EditDetailForm = (props: {
    detailItem: ProductPriceListDetailDto,
    dataItem?: ProductPriceListDto,
    onSuccess?: () => void, 
    onCancel?: () => void,
}) => {
    const [form] = Form.useForm();
    const { t } = useTranslation('price-list-detail');
    const { productPriceListDetailStore: mainStore } = useStore();
    const [calculatePriceMethod, setCalculatePriceMethod] = useState<number>(1);
    const [calculatePriceType, setCalculatePriceType] = useState<number>(1);
    const [methodType, setMethodType] = useState<METHOD_TYPE>(METHOD_TYPE.CACULATOR);

    const methodOptions = [
        {
            label: 'Bảng giá chung',
            value: METHOD_TYPE.CACULATOR,
        },
        {
            label: 'Giá bán',
            value: METHOD_TYPE.VALUE,
        }
    ];

    const productPrice = Form.useWatch((values) => {
        let price = props.detailItem.generalPrice || 0;
        if (values.calculateUsePrice == CalculateUsePrice.GIA_VON) {
            price = props.detailItem.costPrice || 0;
        }
        if (values.calculateUsePrice == CalculateUsePrice.GIA_HIEN_TAI) {
            price = props.detailItem.productPrice || 0;
        }

        const inputValue = values.calculatePriceValue || 0;
        const calculate = values.calculatePriceMethod == 2 ? -1 : 1;
        let newData = price + inputValue * calculate;
        if (values.calculatePriceType == 1) {
            newData = price + price * (inputValue / 100) * calculate;
        }
        return newData > 0 ? newData : 0;
    }, form)

    useEffect(() => {
        setCalculatePriceMethod(props.detailItem.calculatePriceMethod ?? 1);
        form.setFieldsValue({ ...props.detailItem });

        const calculatePriceType = props.detailItem.id
            ? props.detailItem?.calculatePriceType
            : props.dataItem?.calculatePriceType;

        setCalculatePriceType(calculatePriceType ?? 1);

    }, [props.detailItem]);

    useEffect(() => {
        if (calculatePriceMethod == 0) {
            setMethodType(METHOD_TYPE.VALUE);
        } else {
            setMethodType(METHOD_TYPE.CACULATOR);
        }
    }, [calculatePriceMethod])

    const updatePriceMethod = useCallback((value: CALCULATE_PRICE_METHOD) => {
        setCalculatePriceMethod(value);
        form.setFieldValue("calculatePriceMethod", value);
    }, [calculatePriceMethod])

    const updatePriceType = useCallback((value: CALCULATE_PRICE_METHOD) => {
        setCalculatePriceType(value);
        form.setFieldValue("calculatePriceType", value);
    }, [calculatePriceType])

    const handleChangeMethodType = (value: METHOD_TYPE) => {
        setMethodType(value);
        if (value == METHOD_TYPE.VALUE) {
            form.setFieldValue("calculatePriceType", 0);
            form.setFieldValue("calculatePriceMethod", 0);
        }
    }

    const onSubmit = () => {
        UiUtils.setBusy();
        const _body = prepareBody();
        ProductPriceListDetailService.updateDetail({ body: _body }).then(rsp => {
            if (rsp.isSuccessful) {
                UiUtils.showSuccess(t('updateDetailSuccess'));
                props.onSuccess && props.onSuccess();
            } else {
                UiUtils.showError(rsp.errorDetail?.message)
            }
            UiUtils.clearBusy();
        }, error => {
            UiUtils.showError(error.message);
            UiUtils.clearBusy();
        })
    }

    const prepareBody = () => {
        const values = form.getFieldsValue();
        return {
            isApplyAll: values.isApplyAll,
            id: props.detailItem.id,
            productId: props.detailItem.productId,
            productUnitId: props.detailItem.productUnitId,
            priceListId: props.dataItem?.id,
            generalPrice: props.detailItem.generalPrice,
            productPrice: props.detailItem.productPrice,
            calculatePriceMethod: values.calculatePriceMethod,
            calculatePriceType: values.calculatePriceType,
            calculatePriceValue: values.calculatePriceValue,
            productPriceListDto: {
                id: props.dataItem?.id,
                calculatePriceMethod: values.calculatePriceMethod,
                calculatePriceType: values.calculatePriceType,
                calculatePriceValue: values.calculatePriceValue,
            }
        }
    }

    return <div>
        <h3 className="text-md font-semibold mb-4">Cập nhật giá bán</h3>
        <Form form={form} onFinish={onSubmit}>
            <div className="grid grid-cols-5 gap-3 w-[600px]">
                <div className="flex col-span-2">
                    <Select style={{ width: '100%' }}
                        value={methodType}
                        options={methodOptions}
                        onChange={handleChangeMethodType}
                    ></Select>
                </div>
                <Flex className="gap-3 col-span-3">
                    {methodType == METHOD_TYPE.CACULATOR && <Space.Compact>
                        <Button onClick={() => updatePriceMethod(1)}
                            type={calculatePriceMethod == 1 ? "primary" : "default"}><PlusOutlined></PlusOutlined></Button>
                        <Button onClick={() => updatePriceMethod(2)}
                            type={calculatePriceMethod == 2 ? "primary" : "default"}><MinusOutlined></MinusOutlined></Button>
                    </Space.Compact>}
                    {methodType == METHOD_TYPE.VALUE && <Space.Compact>
                        <Button
                            type={"default"}>=</Button>
                    </Space.Compact>}
                    <FloatLabel style={{ flex: 1 }} label={t('calculatePriceValue')}>
                        <Form.Item noStyle name="calculatePriceValue">
                            <PriceNumberInput />
                        </Form.Item>
                    </FloatLabel>
                    {methodType == METHOD_TYPE.CACULATOR && <Space.Compact>
                        <Button onClick={() => updatePriceType(1)}
                            type={calculatePriceType == 1 ? "primary" : "default"}>%</Button>
                        <Button onClick={() => updatePriceType(2)}
                            type={calculatePriceType == 2 ? "primary" : "default"}>VNĐ</Button>
                    </Space.Compact>}
                </Flex>
            </div>
            <Form.Item name="isApplyAll" valuePropName="checked" hidden={methodType == METHOD_TYPE.VALUE}>
                <Checkbox>{t('Áp dụng công thức cho bảng giá')}</Checkbox>
            </Form.Item>
            <Flex style={{ justifyContent: "right" }} gap={8}>
                <Button onClick={() => props.onCancel && props.onCancel()} type={"default"}><CloseOutlined></CloseOutlined> {t('close')}</Button>
                <Button onClick={() => form.submit()} type={"primary"}><SaveOutlined></SaveOutlined> {t('save')}</Button>
            </Flex>

            <div hidden>
                <Form.Item initialValue={1} name="calculatePriceMethod" hidden><Input /></Form.Item>
                <Form.Item initialValue={1} name="calculatePriceType" hidden><Input /></Form.Item>
            </div>
        </Form>
    </div>
}
