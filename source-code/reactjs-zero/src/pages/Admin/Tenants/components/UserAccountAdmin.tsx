import {Col, Form, Input} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import React from "react";
import {useTranslation} from "react-i18next";

export const UserAccountAdmin: React.FC = () => {
    const {t} = useTranslation();
    const code_w = Form.useWatch('code');
    return <>
        <Col span={12}>
            <FloatLabel label={t('userNameAdminTenant')} required>
                <Form.Item name='adminUsername'
                           rules={[ValidateUtils.required, ValidateUtils.userName]}
                           initialValue={'admin'}
                >
                    <Input addonBefore={code_w ? (code_w + '_') : ''} maxLength={200}/>
                </Form.Item>
            </FloatLabel>
        </Col>
        <Col span={12}>
            <FloatLabel label={t('passwordAdminTenant')} required>
                <Form.Item name='adminPassword'
                           rules={[ValidateUtils.required, ValidateUtils.password]}>
                    <Input maxLength={200}/>
                </Form.Item>
            </FloatLabel>
        </Col>
    </>;
}