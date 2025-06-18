import {useTranslation} from "react-i18next";
import React from "react";
import {Checkbox, Form, Input, Row, Space} from "antd";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {observer} from "mobx-react-lite";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectProductType} from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import {useSelectProductGroup} from "@ord-components/forms/select/selectDataSource/useSelectProductGroup";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import {TaxCodeNotUse} from "@ord-core/AppConst";

const ProductTabContent = () => {
    const {t} = useTranslation('product');
    const form = Form.useFormInstance();

    return (<>
        <Row gutter={16}>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('code')}>
                    <Form.Item name='productCode'>
                        <Input/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('name')}>
                    <Form.Item name='productName'>
                        <Input/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('type')}>
                    <Form.Item name='productTypeId'>
                        <OrdSelect datasource={useSelectProductType()}/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('ProductGroup')}>
                    <Form.Item name='listProductGroupId'>
                        <OrdSelect datasource={useSelectProductGroup()}/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('BasicUnitName')}>
                    <Form.Item name='basicUnitName'>
                        <Input/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('ProductPrice')}>
                    <Form.Item name='productPrice'>
                        <PriceNumberInput step={1000} min={0}/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('TaxPercent')}>
                    <Form.Item name='taxCode' initialValue={TaxCodeNotUse}>
                        <OrdSelect datasource={useSelectTaxCode()}
                                   onChange={(data, option: IOrdSelectOption) => {
                                       form.setFieldValue("taxPercent", option.data?.taxPercent);
                                   }}
                        />
                    </Form.Item>
                    <Form.Item hidden name='taxPercent' />
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('barCode')}>
                    <Form.Item name='barCode'>
                        <Input/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={24}>
                <Space>
                    <Form.Item name='isStatic' hidden valuePropName="checked" initialValue={true}>
                        <Checkbox>{t('isStatic')}</Checkbox>
                    </Form.Item>
                    <Form.Item name='isProductUseInventory' valuePropName="checked">
                        <Checkbox>{t('IsProductUseInventory')}</Checkbox>
                    </Form.Item>
                    <Form.Item name='isProductUseLotNumber' valuePropName="checked">
                        <Checkbox>{t('IsProductUseLotNumber')}</Checkbox>
                    </Form.Item>
                </Space>
            </ColSpanResponsive>
        </Row>
    </>);
}
export default observer(ProductTabContent);
