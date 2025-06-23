import {Col, Input, Row} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import React from "react";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";

export const EntityForm = () => {
    const focusRef = useAutoFocus();
    return (<>
        <Row gutter={18}>
            <Col span={24}>
                <OrdFormField label={'code'} name='code' rules={[ValidateUtils.required]}
                              required>
                    <Input maxLength={10} ref={focusRef}/>
                </OrdFormField>
            </Col>
            <Col span={24}>
                <OrdFormField label={'name'} name='name' rules={[ValidateUtils.required]}
                              required>
                    <Input maxLength={100}/>
                </OrdFormField>
            </Col>
            <Col span={12}>
                <OrdFormField label={'phone_code'} name='phoneCode'>
                    <Input maxLength={50}/>
                </OrdFormField>
            </Col>
            <Col span={12}>
                <OrdFormField label={'currency_code'} name='currencyCode'>
                    <Input maxLength={50}/>
                </OrdFormField>
            </Col>
            <Col span={24}>
                <OrdFormField
                    name="isActived"
                    label="dang_hoat_dong"
                    isCheckbox initialValue={true}
                />
            </Col>
        </Row>
    </>)
}