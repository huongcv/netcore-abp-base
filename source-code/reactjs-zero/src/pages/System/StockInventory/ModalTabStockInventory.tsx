import {useTranslation} from "react-i18next";
import {Checkbox, Col, Form, Input, Row, Tabs, TabsProps} from "antd";
import React from "react";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectStockType} from "@ord-components/forms/select/selectDataSource/useSelectStockType";
import {InfoCircleOutlined, WindowsOutlined} from "@ant-design/icons";
import ConfigModifyStockInventory from "@pages/System/StockInventory/ConfigModifyStockInventory";

export const ModalTabStockInventory = () => {
    const {t: tCommon} = useTranslation(['common']);
    const {t} = useTranslation(['stock']);

    const itemTab: TabsProps["items"] = [
        {
            icon: <InfoCircleOutlined />,
            key: '1',
            label: t('stockInfo'),
            children: <>
                <Row gutter={12}>
                    <Col span={8}>
                        <FloatLabel label={t('inventoryCode')} required>
                            <Form.Item name='inventoryCode' rules={[ValidateUtils.required]}>
                                <Input maxLength={10}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={8}>
                        <FloatLabel label={t('inventoryType')} required>
                            <Form.Item name='inventoryType' rules={[ValidateUtils.required]}>
                                <OrdSelect datasource={useSelectStockType()} placeholder={tCommon('')}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={8}>
                        <Form.Item noStyle name='isActived' valuePropName="checked" initialValue={true}>
                            <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                        </Form.Item>
                    </Col>


                    <Col span={16}>
                        <FloatLabel label={t('inventoryName')} required>
                            <Form.Item name='inventoryName' rules={[ValidateUtils.required]}>
                                <Input maxLength={100}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={8}>
                        <FloatLabel label={t('inventoryTel')}>
                            <Form.Item name='inventoryTel'>
                                <Input maxLength={100}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={16}>
                        <FloatLabel label={t('inventoryAddress')} >
                            <Form.Item name='inventoryAddress'>
                                <Input maxLength={100}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={8}>
                        <FloatLabel label={t('inventoryEmail')} >
                            <Form.Item name='inventoryEmail'>
                                <Input maxLength={100}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
            </>
        },
        {
            icon: <WindowsOutlined />,
            key: '2',
            label: t('configModify'),
            children: <ConfigModifyStockInventory></ConfigModifyStockInventory>
        }
    ]

   return <>
       <Tabs
           items={itemTab}
           type="card"
       />
   </>


}

export default ModalTabStockInventory
