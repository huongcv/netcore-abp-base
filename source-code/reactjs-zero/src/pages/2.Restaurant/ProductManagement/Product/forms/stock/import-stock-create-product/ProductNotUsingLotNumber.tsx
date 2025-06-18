import {Col, Form, Input} from "antd";
import {useTranslation} from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {InitNumberInput} from "@ord-components/forms/InitNumberInput";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import React, {useEffect} from "react";
import {useStockMainName} from "@ord-components/hooks/useStockMain";

const ImportStockWhenCreateProductNotUsingLot = () => {
    const form = Form.useFormInstance();
    const [t] = useTranslation('product');
    const costPrice_w = Form.useWatch('costPrice');
    useEffect(() => {
        form.setFieldValue('inventoryCurrentCostPrice', costPrice_w);
    }, [costPrice_w]);
    const [mainStockName] = useStockMainName();
    return (<>
        <Col span={6}>
            <FloatLabel label={t('currentStockInventory')}>
                <Form.Item name={'inventoryCurrentQty'}>
                    <InitNumberInput min={0}/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={6}>
            <FloatLabel label={t('currentCostPrice')}>
                <Form.Item name={'inventoryCurrentCostPrice'} initialValue={0}>
                    <PriceNumberInput min={0} disabled/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={12}>
            <FloatLabel label={t('InventoryId')}>
                <Input disabled value={mainStockName}></Input>
            </FloatLabel>
        </Col>

    </>);
}
export default ImportStockWhenCreateProductNotUsingLot;
