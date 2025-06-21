import OrdDateInput from "@ord-components/forms/OrdDateInput";
import DateUtil from "@ord-core/utils/date.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {Col, Form, Input, Row} from "antd";
import {useTranslation} from "react-i18next";
import {useUserLogic} from "@pages/Admin/Users/useUserLogic";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";

const UserEntityForm = () => {
    const {t} = useTranslation();
    const {modalStore} = useUserLogic();
    const {mode} = modalStore();

    const form = Form.useFormInstance();
    const firstFocusRef = useAutoFocus();
    return (<>
        <Row gutter={18}>
            <Col span={12}>
                <OrdFormField
                    name="userName"
                    label="UserName"
                    required
                    rules={mode === 'create' ? [ValidateUtils.required, ValidateUtils.userName] : []}
                    disabled={mode !== 'create'}
                >
                    <Input ref={firstFocusRef} maxLength={200}/>
                </OrdFormField>
            </Col>
            {mode !== 'viewDetail' && <Col span={12}>
                <OrdFormField
                    name="password"
                    label="Password"
                    required={mode === 'create'}
                    rules={[
                        mode === 'create' ? ValidateUtils.required : ValidateUtils.alwaysValid,
                        ValidateUtils.password,
                    ]}
                >
                    <Input type="password" autoComplete="off" maxLength={100} placeholder={mode === 'edit' ? t('emptyIfNotChangePassword') : ''}/>
                </OrdFormField>

            </Col>}
            <Col span={12}>
                <OrdFormField
                    name="name"
                    label="FullName"
                    required
                    maxLength={200}
                    rules={[ValidateUtils.required]}/>
            </Col>
            <Col span={12}>
                <OrdFormField name="birthDay" label="BirthDay">
                    <OrdDateInput disabledDate={DateUtil.disableAfterNow}/>
                </OrdFormField>
            </Col>
            <Col span={12}>
                <OrdFormField name='email' label='Email' maxLength={300}/>
            </Col>
            <Col span={12}>
                <OrdFormField name='phoneNumber'
                              rules={[ValidateUtils.phoneNumberVietNam]}
                              label='PhoneNumber'
                              maxLength={10}/>
            </Col>
            <Col span={24}>
                <OrdFormField
                    name="mustChangePassword"
                    label="mustChangePassword"
                    isCheckbox
                />
            </Col>
            <Col span={24}>
                <OrdFormField
                    name="isLockoutEnabled"
                    label="isLockoutEnabled"
                    isCheckbox
                />
            </Col>
            <Col span={24}>
                <OrdFormField
                    name="isActived"
                    label="dang_hoat_dong"
                    isCheckbox
                />
            </Col>
        </Row>
    </>)
}
export default UserEntityForm;
