import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {useStore} from "@ord-store/index";
import {Checkbox, Col, Form, InputNumber, Row} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useTranslation} from "react-i18next";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import UiUtils from "@ord-core/utils/ui.utils";
import {ShopSettingDto} from "@api/index.defs";

import {ShopSettingService} from "@api/ShopSettingService";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { IFormSettingShop_General, SETTING_NAME_FOR_SHOP, PROP_SETTING_SHOP_General } from './setting-name.const';
import OrdCheckBoxText from "@ord-components/forms/OrdCheckBoxText";

interface Props {
}

// Define the ref type
export type ShopSettingGeneralInfoRef = {
    saveData: () => void;
};

const ShopSettingGeneralInfo = forwardRef<ShopSettingGeneralInfoRef, Props>((props, ref) => {
    const {sessionStore} = useStore();
    const {t} = useTranslation('shop-setting');
    const [cusForm] = Form.useForm<IFormSettingShop_General>();
    useEffect(() => {
        ShopSettingService.getGeneralInfo()
            .then(res => {
                let formValue = {} as IFormSettingShop_General;
                Object.entries(SETTING_NAME_FOR_SHOP.general)
                    .forEach(([formKey, valueKey]) => {
                        const findValue = res.find(x => x.name == valueKey);
                        formValue[formKey as PROP_SETTING_SHOP_General] = findValue?.value;
                    })
                console.log("FormValue", formValue)
                cusForm.setFieldsValue(formValue);
            })
    }, []);
    // Pass the ref to the useImperativeHandle hook
    useImperativeHandle(ref, () => ({
        saveData: () => {
            // getProperty(SETTING_NAME_FOR_SHOP, '')
            saveData().then();
        }
    }));
    const saveData = async () => {
        try {
            const data = await cusForm.validateFields();
            // UiUtils.setBusy();
            try {

                const input: ShopSettingDto[] = [];
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.general.expiredWarning,
                    value:  data.expiredWarning?.toString()
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.general.closingDate,
                    value: data.closingDate
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.general.isCustomerCodePrefixByGroup,
                    value: data.isCustomerCodePrefixByGroup
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.general.isSingleCustomerGroup,
                    value: data.isSingleCustomerGroup
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.general.isSingleEmployeeGroup,
                    value: data.isSingleEmployeeGroup
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.general.isEmployeeCodePrefixByGroup,
                    value: data.isEmployeeCodePrefixByGroup
                })

                await ShopSettingService.setListValue({
                    body: input
                }).then(result => {
                    UiUtils.showSuccess(t('updateSuccess', {
                        ...data
                    }) as any);
                    setTimeout(()=>{
                        window.location.reload();
                    },5000)
                }).catch((e) => {
                    UiUtils.showError(t(e.response?.data?.error?.message))
                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }
    const w_isSingleCustomerGroup = Form.useWatch('isSingleCustomerGroup', cusForm);
    const w_isSingleEmployeeGroup = Form.useWatch('isSingleEmployeeGroup', cusForm);
    return (
        <div>
            <Form form={cusForm}
                  layout={'vertical'}>

                <Row gutter={16}>

                    <Col {...useResponsiveSpan(6)}>
                        <FloatLabel label={t('expiredWarning')}>
                            <Form.Item name='expiredWarning'>
                                <InputNumber placeholder='Mặc định: 1 ngày' style={{width: '100%'}}
                                             min={0}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(6)}>
                        <FloatLabel label={t('closingDate')}>
                            <Form.Item name='closingDate'>
                                <OrdDateInput></OrdDateInput>
                            </Form.Item>
                        </FloatLabel>

                    </Col>

                    <Col {...useResponsiveSpan(6)} hidden={!(!sessionStore.appSession.isShopMain && sessionStore.user?.tenantDto?.type == 100)}>
                        <Form.Item className='my-1 block' name='useCenterBilling'
                            valuePropName="checked"
                            initialValue={true}>
                            <Checkbox >{t('payByCenterBiiling')}</Checkbox>
                        </Form.Item>

                    </Col>


                </Row>
                <Row>
                    <Col {...useResponsiveSpan(6)}>
                        <Form.Item name="isSingleCustomerGroup">
                            <OrdCheckBoxText>
                                {t('isSingleCustomerGroup')}
                            </OrdCheckBoxText>
                        </Form.Item>
                    </Col>
                    <Col {...useResponsiveSpan(6)} hidden={w_isSingleCustomerGroup!='true'}>
                        <Form.Item name="isCustomerCodePrefixByGroup">
                            <OrdCheckBoxText>
                                {t('isCustomerCodePrefixByGroup')}
                            </OrdCheckBoxText>
                        </Form.Item>
                    </Col>
                    <Col {...useResponsiveSpan(6)}>
                        <Form.Item name="isSingleEmployeeGroup">
                            <OrdCheckBoxText>
                                {t('isSingleEmployeeGroup')}
                            </OrdCheckBoxText>
                        </Form.Item>
                    </Col>
                    <Col {...useResponsiveSpan(6)} hidden={w_isSingleEmployeeGroup!='true'}>
                        <Form.Item name="isEmployeeCodePrefixByGroup">
                            <OrdCheckBoxText>
                                {t('isEmployeeCodePrefixByGroup')}
                            </OrdCheckBoxText>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

        </div>
    );
});


export default ShopSettingGeneralInfo;
