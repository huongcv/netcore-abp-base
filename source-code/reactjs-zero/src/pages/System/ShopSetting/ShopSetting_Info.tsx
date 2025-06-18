import { ShopDto } from "@api/index.defs";
import { ShopService } from "@api/ShopService";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectDistrict } from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import { useSelectProvince } from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import { useSelectShopTypeEnum } from "@ord-components/forms/select/selectDataSource/useSelectShopTypeEnum";
import { useSelectWard } from "@ord-components/forms/select/selectDataSource/useSelectWard";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import UiUtils from "@ord-core/utils/ui.utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Col, Form, Input, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from "react-i18next";
import { LogoImgUpload } from './LogoImgUpload';
import {useSelectProductPriceList} from "@ord-components/forms/select/selectDataSource/useSelectProductPriceList";
import {ShopType} from "@ord-core/model/side-nav.type";

interface Props {
}

// Define the ref type
export type ShopSettingInfoRef = {
    saveData: () => void;
};


const ShopSettingInfo = forwardRef<ShopSettingInfoRef, Props>((props, ref) => {
    const {sessionStore} = useStore();
    const {t} = useTranslation('shop-setting');
    const [cusForm] = Form.useForm();
    const [dataShop, setDataShop] = useState<ShopDto>();

    useEffect(() => {
        ShopService.getById({
            findId: sessionStore?.currentShopId ?? 0
        })
            .then(res => {
                cusForm.setFieldsValue(res);
                setDataShop(res);

            })

    }, []);
    useImperativeHandle(ref, () => ({
        saveData: () => {
            saveData().then()
        }
    }));
    const saveData = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {

                const input: ShopDto = {
                    ...dataShop,
                    ...data
                }

                await ShopService.updateShopInfo({
                    body: input
                }).then(result => {
                    if (result) {
                        UiUtils.showSuccess(t('updateSuccess', {
                            ...data
                        }) as any);
                        setTimeout(()=>{
                            window.location.reload();
                        },5000)
                    }

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
    return (
        <div>
            <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex-none w-36">
                    <Form form={cusForm}>
                        <Form.Item name='logoId'>
                            <LogoImgUpload
                                shopId={sessionStore?.currentShopId ?? 0}
                                isMain={Form.useWatch('isMain', cusForm)}
                            ></LogoImgUpload>
                        </Form.Item>
                    </Form>

                </div>
                <div className="grow">
                    <Form form={cusForm}
                          layout={'vertical'}>
                        <Form.Item hidden name='isMain'>
                            <Input/>
                        </Form.Item>
                        <Row gutter={16}>

                            <Col {...useResponsiveSpan(4)}>
                                <FloatLabel label={t('code')}>
                                    <Form.Item name='code'>
                                        <Input disabled={true} maxLength={10}/>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col {...useResponsiveSpan(12)}>
                                <FloatLabel label={t('name')} required>
                                    <Form.Item name='name' rules={[ValidateUtils.required]}>
                                        <Input maxLength={100}/>
                                    </Form.Item>
                                </FloatLabel>

                            </Col>
                            <Col {...useResponsiveSpan(8)}>
                                <FloatLabel label={t('taxCode')}>
                                    <Form.Item name='taxCode'>
                                        <Input></Input>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>


                            <Col {...useResponsiveSpan(8)}>
                                <FloatLabel label={t('phone')}>
                                    <Form.Item name='phone' rules={[ValidateUtils.phoneNumberVietNam]}>
                                        <Input maxLength={14}/>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col {...useResponsiveSpan(8)}>
                                <FloatLabel label={t('email')}>
                                    <Form.Item name='email' rules={[ValidateUtils.email]}>
                                        <Input maxLength={14}/>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>

                            <Col {...useResponsiveSpan(8)}>
                                <FloatLabel label={t('shopType')}>
                                    <Form.Item name='type'>
                                        <OrdSelect disabled datasource={useSelectShopTypeEnum()}></OrdSelect>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                        </Row>
                        {/*<Row gutter={16}>*/}

                        {/*    <Col {...useResponsiveSpan(8)}>*/}
                        {/*        <FloatLabel label={t('cashBookMainId')}>*/}
                        {/*            <Form.Item name='cashBookMainId'>*/}
                        {/*                <OrdSelect datasource={useSelectCashbook()}></OrdSelect>*/}
                        {/*            </Form.Item>*/}
                        {/*        </FloatLabel>*/}
                        {/*    </Col>*/}
                        {/*    <Col {...useResponsiveSpan(8)}>*/}
                        {/*        <FloatLabel label={t('inventoryMainId')}>*/}
                        {/*            <Form.Item name='inventoryMainId'>*/}
                        {/*                <OrdSelect datasource={useSelectStock()}></OrdSelect>*/}
                        {/*            </Form.Item>*/}
                        {/*        </FloatLabel>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}

                        <Row gutter={16}>

                                <Col {...useResponsiveSpan(8)}>
                                    <FloatLabel label={t('productPriceListMainId')}>
                                        <Form.Item name='productPriceListMainId'>
                                            <OrdSelect datasource={useSelectProductPriceList()}></OrdSelect>
                                        </Form.Item>
                                    </FloatLabel>
                                </Col>
                            <Col span={16}>
                                <FloatLabel label={t('address')}>
                                    <Form.Item name='address'>
                                        <Input></Input>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col {...useResponsiveSpan(8)}>
                                <FloatLabel label={t('provinceCode')}>
                                    <Form.Item name='provinceCode'>
                                        <OrdSelect datasource={useSelectProvince()}></OrdSelect>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col {...useResponsiveSpan(8)}>
                                <FloatLabel label={t('districtCode')}>
                                    <Form.Item name='districtCode'>
                                        <OrdSelect
                                            datasource={useSelectDistrict(Form.useWatch("cityCode", cusForm))}/>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col {...useResponsiveSpan(8)}>
                                <FloatLabel label={t('communeCode')}>
                                    <Form.Item name='communeCode'>
                                        <OrdSelect
                                            datasource={useSelectWard(Form.useWatch("districtCode", cusForm))}/>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>

                        </Row>

                        <Row>
                            <Col span={24}>
                                <FloatLabel label={t('notes')}>
                                    <Form.Item name='notes'>
                                        <Input.TextArea rows={2}></Input.TextArea>
                                    </Form.Item>
                                </FloatLabel>

                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

        </div>
    );
});

export default ShopSettingInfo;
