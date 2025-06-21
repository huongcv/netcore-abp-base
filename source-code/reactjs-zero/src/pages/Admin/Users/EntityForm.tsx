import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import DateUtil from "@ord-core/utils/date.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useStore} from "@ord-store/index";
import {Checkbox, Col, Form, Input, Row} from "antd";
import {useTranslation} from "react-i18next";
import {useUserLogic} from "@pages/Admin/Users/useUserLogic";

const UserEntityForm = () => {
    const {useHostListStore: mainStore, sessionStore} = useStore();
    const {modalStore} = useUserLogic();
    const {mode} = modalStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tCommon} = useTranslation('common');
    const form = Form.useFormInstance();
    return (<>
        <Row gutter={18}>
            <Col span={12}>
                <FloatLabel label={tCommon('UserName')} required>
                    <Form.Item
                        name='userName' rules={[ValidateUtils.required, ValidateUtils.userName]}>
                        <Input
                            addonBefore={(mode === 'create' && sessionStore.tenantCode ? sessionStore.tenantCode + '_' : '')}
                            autoComplete="none" maxLength={30} disabled={mode !== 'create'}/>

                    </Form.Item>
                </FloatLabel>

            </Col>
            {mode !== 'viewDetail' && <Col span={12}>
                <FloatLabel label={tCommon('Password')} required={mode === 'create'}>
                    <Form.Item
                        name='password'
                        rules={[mode === 'create' ? ValidateUtils.required : ValidateUtils.alwaysValid, ValidateUtils.password]}>
                        <Input autoComplete="none"
                               placeholder={mode === 'edit' ? t('emptyIfNotChangePassword') : ''}
                               maxLength={100}/>
                    </Form.Item>
                </FloatLabel>

            </Col>}
            <Col span={12}>
                <FloatLabel label={t('Name')} required>
                    <Form.Item
                        name='name' rules={[ValidateUtils.required]}>
                        <Input maxLength={200}/>
                    </Form.Item>
                </FloatLabel>

            </Col>
            <Col span={12}>
                <FloatLabel label={tCommon('BirthDay')}>
                    <Form.Item
                        name='birthDay' rules={[]}>
                        <OrdDateInput disabledDate={DateUtil.disableAfterNow}/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label='Email'>
                    <Form.Item name='email' rules={[ValidateUtils.email]}>
                        <Input maxLength={300}/>
                    </Form.Item>
                </FloatLabel>

            </Col>
            <Col span={12}>
                <FloatLabel label={tCommon('PhoneNumber')}>
                    <Form.Item
                        name='phoneNumber' rules={[ValidateUtils.phoneNumberVietNam]}>
                        <Input maxLength={10}/>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={24}>
                <Form.Item name='mustChangePassword' valuePropName="checked">
                    <Checkbox>{t('mustChangePassword')}</Checkbox>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item name='isLockoutEnabled' valuePropName="checked">
                    <Checkbox>{t('isLockoutEnabled')}</Checkbox>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item name='isActived' valuePropName="checked">
                    <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                </Form.Item>
            </Col>
        </Row>
    </>)
}
export default UserEntityForm;
