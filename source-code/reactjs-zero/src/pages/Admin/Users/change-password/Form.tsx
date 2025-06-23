import {useTranslation} from "react-i18next";
import {Col, Form, Input} from "antd";
import React from "react";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";

export const ChangePasswordForm = () => {
    const {t} = useTranslation();
    return (<>
        <Form.Item name={'encodedId'} hidden noStyle></Form.Item>
        <Col span={24}>
            <OrdFormField
                name="name"
                label="full_name"
                disabled
            />
        </Col>
        <Col span={24}>
            <OrdFormField
                name="userName"
                label="UserName"
                disabled
            />
        </Col>
        <Col span={24}>
            <OrdFormField
                name="newPassword"
                label="Password"
                rules={[ValidateUtils.required, ValidateUtils.password]}
            >
                <Input.Password autoComplete='off'/>
            </OrdFormField>
        </Col>
        <Col span={24}>
            <OrdFormField
                name="mustChangePassword"
                label="mustChangePassword"
                isCheckbox
            />
        </Col>
    </>);
}
