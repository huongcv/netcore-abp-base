import React, {useEffect} from 'react';
import {useStore} from "@ord-store/index";
import {useForm} from "antd/lib/form/Form";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Input, Row, Space} from "antd";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectShopTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectShopTypeEnum";
import {TenantService} from "@api/TenantService";
import UiUtils from "@ord-core/utils/ui.utils";
import uiUtils from "@ord-core/utils/ui.utils";

const ShopInformation = () => {
    const {tenantListStore} = useStore();
    const [form] = useForm();
    const {t} = useTranslation('tenant-list');
    const {t: tCommon} = useTranslation('common');
    useEffect(() => {
        if (tenantListStore.shopDetail) {
            form.setFieldsValue({
                ...tenantListStore.shopDetail
            });
        }
    }, [tenantListStore.shopDetail]);

    const onFinish = async (values: any) => {
        try {
            UiUtils.setBusy();
            const result = await TenantService.updateShop({
                body: {
                    name: values.name,
                    address: values.address,
                    phone: values.phone,
                    email: values.email,
                    idHash: values.idHash,
                }
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            UiUtils.showSuccess('Cập nhật cửa hàng thành công');
        } catch (ex) {
            console.error(ex)
        } finally {
            UiUtils.clearBusy();
        }
    }

    return (
        <>
            <Form form={form} onFinishFailed={() => uiUtils.showCommonValidateForm()} onFinish={onFinish} layout='vertical' >
                <Row gutter={16}>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('code')} required>
                            <Form.Item
                                name='code' required>
                                <Input disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(8)}>
                        <FloatLabel label={t('name')} required>
                            <Form.Item
                                rules={[ValidateUtils.required]}
                                name='name'>
                                <Input/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col  {...useResponsiveSpan(4)} >
                        <FloatLabel label={t('shopType')} required>
                            <Form.Item name='type' rules={[ValidateUtils.required]}>
                                <OrdSelect allowClear disabled datasource={useSelectShopTypeEnum()}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col  {...useResponsiveSpan(4)} >
                        <FloatLabel label={t('PhoneNumber')}>
                            <Form.Item name='phone' rules={[ValidateUtils.phoneNumberVietNam]}>
                                <Input maxLength={200}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('Email')}>
                            <Form.Item name='email' rules={[ValidateUtils.email]}>
                                <Input maxLength={200}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(24)}>
                        <FloatLabel label={tCommon('Address')}>
                            <Form.Item name='address'>
                                <Input maxLength={200}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>

                <div hidden>
                    <Form.Item name='idHash'/>
                </div>
            </Form>
            <div className='flex justify-end'>
                <Space> <Button onClick={form.submit}>Chỉnh sửa </Button> </Space>
            </div>
        </>
    );
};

export default ShopInformation;