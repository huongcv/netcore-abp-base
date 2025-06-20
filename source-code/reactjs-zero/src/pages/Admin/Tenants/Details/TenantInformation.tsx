import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import React, {useEffect} from "react";
import {Col, Form, Input, Row} from "antd";
import {useForm} from "antd/lib/form/Form";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {useTranslation} from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectTenantTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectTenantTypeEnum";

const TenantInformation = () => {
    const {tenantListStore} = useStore();
    const [form] = useForm();
    const {t} = useTranslation('tenant-list');
    const {t: tCommon} = useTranslation('common');
    useEffect(() => {
        if (tenantListStore.tenantDetail) {
            form.setFieldsValue({
                ...tenantListStore.tenantDetail
            });
        }
    }, [tenantListStore.tenantDetail]);

    return (<>

        <Form form={form} layout='vertical' disabled>
            <Row gutter={16}>
                <Col {...useResponsiveSpan(4)}>
                    <FloatLabel label={t('code')}>
                        <Form.Item
                            name='code'>
                            <Input/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...useResponsiveSpan(8)}>
                    <FloatLabel label={t('name')}>
                        <Form.Item
                            name='name'>
                            <Input/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col  {...useResponsiveSpan(4)} >
                    <FloatLabel label={t('tenantType')}>
                        <Form.Item name='type' rules={[ValidateUtils.required]}>
                            <OrdSelect allowClear disabled datasource={useSelectTenantTypeEnum()}
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col  {...useResponsiveSpan(4)} >
                    <FloatLabel label={t('PhoneNumber')}>
                        <Form.Item name='phoneNumber' rules={[ValidateUtils.phoneNumberVietNam]}>
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
        </Form>
    </>)
}
export default observer(TenantInformation);
