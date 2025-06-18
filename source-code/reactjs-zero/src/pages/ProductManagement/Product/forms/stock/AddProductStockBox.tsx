import {Checkbox, Col, Form, Space} from "antd";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import './index.scss';
import {ImportStockInitial} from "@pages/ProductManagement/Product/forms/stock/ImportStockInitial";
import {productExt} from "@pages/ProductManagement/Product/forms/BaseInforGroup";

export const AddProductStockBox = () => {
    const [t] = useTranslation('product');

    const form = Form.useFormInstance();
    const isProductUseInventory_w = Form.useWatch('isProductUseInventory');
    const drugSys_w = Form.useWatch(productExt("isConnectNationalDrugSystem"))
    const [disable, setDisable] = useState<boolean>();
    useEffect(() => {
        if (isProductUseInventory_w == false) {
            form.setFieldValue('isProductUseLotNumber', false);
        }
    }, [isProductUseInventory_w, drugSys_w]);
    useEffect(() => {
        if (drugSys_w=='true') {
            form.setFieldsValue({
                isProductUseLotNumber:true,
                IsProductUseInventory: true
            });
            setDisable(true)

        }else{
            setDisable(false)
        }
    }, [drugSys_w]);
    return (<>
        <Col span={24}>
            <div className={'title-stock-product-box flex flex-wrap items-center justify-between'}>
                <h3 className={''}>
                    {t('productUsingStockManagement')}
                </h3>
                <div className={'flex items-center'}>
                    <Space wrap>
                        <Form.Item noStyle name='isProductUseInventory' valuePropName="checked">
                            <Checkbox disabled={disable}>{t('IsProductUseInventory')}</Checkbox>
                        </Form.Item>
                        <Form.Item noStyle name='isProductUseLotNumber' valuePropName="checked">
                            <Checkbox
                                disabled={isProductUseInventory_w != true || disable}>{t('IsProductUseLotNumber')}</Checkbox>
                        </Form.Item>
                    </Space>
                </div>
            </div>
        </Col>
        <ImportStockInitial mode={'add'}/>
    </>);
}
