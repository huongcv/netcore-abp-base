import {Checkbox, Col, Form, Input, Row} from "antd";
import React from "react";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectTenantTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectTenantTypeEnum";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";

const TenantCreateOrUpdateForm = (prop: {
    isCreateNew: boolean
}) => {
    const {tenantListStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tCommon} = useTranslation('common');
    const form = Form.useFormInstance();
    const code_w = Form.useWatch('code', form);
    return (<>
        <Row gutter={16}>
            <Col span={6}>
                <OrdFormField label='code' name='code' required
                              rules={[ValidateUtils.required, ValidateUtils.NoSpecialCharacter]}
                              maxLength={50}/>
            </Col>
            <Col span={10}>
                <OrdFormField label='tenant_name' name='name' required
                              rules={[ValidateUtils.required]}
                              maxLength={200}/>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('tenantType')} required>
                    <Form.Item name='type' rules={[ValidateUtils.required]}>
                        <OrdSelect allowClear datasource={useSelectTenantTypeEnum()}
                        ></OrdSelect>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <OrdFormField label='PhoneNumber' name='phoneNumber'
                              rules={[ValidateUtils.phoneNumberVietNam]}
                              maxLength={200}/>
            </Col>
            <Col span={12}>
                <OrdFormField label='Email' name='email'
                              rules={[ValidateUtils.email]}
                              maxLength={200}/>
            </Col>
            <Col span={24}>
                <OrdFormField label='Address' name='address'
                              maxLength={200}/>
            </Col>
            {
                prop.isCreateNew &&
                <>
                    <Col span={12}>
                        <FloatLabel label={t('userNameAdminTenant')} required>
                            <Form.Item name='userNameAdminTenant'
                                       rules={[ValidateUtils.required, ValidateUtils.userName]}
                                       initialValue={'admin'}
                            >
                                <Input addonBefore={code_w ? (code_w + '_') : ''} maxLength={200}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('passwordAdminTenant')} required>
                            <Form.Item name='passwordAdminTenant'
                                       rules={[ValidateUtils.required, ValidateUtils.password]}>
                                <Input maxLength={200}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </>
            }
            <Col span={6}>
                <OrdFormField label='dang_hoat_dong' name='isActived' isCheckbox initialValue={true}/>
            </Col>
        </Row>
    </>);
}
export default observer(TenantCreateOrUpdateForm)
