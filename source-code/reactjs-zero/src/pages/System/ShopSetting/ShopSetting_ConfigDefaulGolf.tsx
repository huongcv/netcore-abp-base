import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import {useStore} from "@ord-store/index";
import { Col, Form, Row} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import {ShopSettingDto} from "@api/index.defs";
import {ShopSettingService} from "@api/ShopSettingService";
import { IFormSettingShop_ConfigDefaulGolf, SETTING_NAME_FOR_SHOP,  PROP_SETTING_SHOP_ConfigDefaulGolf } from './setting-name.const';
import { PriceNumberInput } from '@ord-components/forms/PriceNumberInput';
import ProductWithCategorySelect from '@pages/ProductManagement/Product/component/ProductWithCategorySelect';

interface Props {
}

// Define the ref type
export type ShopSettingConfigDefaulGolfRef = {
    saveData: () => void;
};

const ShopSettingConfigDefaulGolf = forwardRef<ShopSettingConfigDefaulGolfRef, Props>((props, ref) => {
    const {sessionStore} = useStore();
    const {t} = useTranslation('shop-setting');
    const [cusForm] = Form.useForm<IFormSettingShop_ConfigDefaulGolf>();
    useEffect(() => {
        ShopSettingService.getConfigDefaulGolfInfo()
            .then(res => {
                let formValue = {} as IFormSettingShop_ConfigDefaulGolf;
                Object.entries(SETTING_NAME_FOR_SHOP.configDefaulGolf)
                    .forEach(([formKey, valueKey]) => {
                        const findValue = res.find(x => x.name == valueKey);
                        formValue[formKey as PROP_SETTING_SHOP_ConfigDefaulGolf] = findValue?.value;
                    })
                //console.log("FormValue", formValue)
                cusForm.setFieldsValue(formValue);
            })
    }, []);
    // Pass the ref to the useImperativeHandle hook
    useImperativeHandle(ref, () => ({
        saveData: () => {
            saveData().then();
        }
    }));
    const saveData = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {

                const input: ShopSettingDto[] = [];
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.configDefaulGolf.golfProductCaddyBookingFeeDefault,
                    value:  data.golfProductCaddyBookingFeeDefault?.toString()
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.configDefaulGolf.golfProductGreenFreeDefault,
                    value: data.golfProductGreenFreeDefault?.toString()
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.configDefaulGolf.golfProductRentalBuggyAllDefault,
                    value: data.golfProductRentalBuggyAllDefault?.toString()
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.configDefaulGolf.golfProductRentalBuggyHalfDefault,
                    value: data.golfProductRentalBuggyHalfDefault?.toString()
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.configDefaulGolf.golfProductRentalCaddyDefault,
                    value: data.golfProductRentalCaddyDefault?.toString()
                })
                await ShopSettingService.setListValue({
                    body: input
                }).then(result => {
                    UiUtils.showSuccess(t('updateSuccess', {
                        ...data
                    }) as any);
                    setTimeout(()=>{
                        window.location.reload();
                    },4000)
                }).catch((e) => {
                    UiUtils.showError(t(e.response?.data?.error?.message))
                })
            } catch (e) {
                console.log(e);
            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }
    return (
        <div>
            <Form form={cusForm}
                  layout={'vertical'}>

                <Row justify="space-between" className='gap-x-2'>
                    <Col flex="1">
                        <FloatLabel label={t('golfProductGreenFreeDefault')}>
                            <Form.Item name='golfProductGreenFreeDefault'>
                                <ProductWithCategorySelect allowClear />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col flex="1">
                        <FloatLabel label={t('golfProductRentalBuggyHalfDefault')}>
                            <Form.Item name='golfProductRentalBuggyHalfDefault'>
                                <ProductWithCategorySelect allowClear/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col flex="1">
                        <FloatLabel label={t('golfProductRentalBuggyAllDefault')}>
                            <Form.Item name='golfProductRentalBuggyAllDefault'>
                                <ProductWithCategorySelect allowClear />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col flex="1">
                        <FloatLabel label={t('golfProductRentalCaddyDefault')}>
                            <Form.Item name='golfProductRentalCaddyDefault'>
                                <ProductWithCategorySelect allowClear />
                            </Form.Item>
                        </FloatLabel>

                    </Col>
                    <Col flex="1">
                        <FloatLabel label={t('golfProductCaddyBookingFeeDefault')}>
                            <Form.Item name='golfProductCaddyBookingFeeDefault'>
                                <ProductWithCategorySelect />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
            </Form>

        </div>
    );
});


export default ShopSettingConfigDefaulGolf;
