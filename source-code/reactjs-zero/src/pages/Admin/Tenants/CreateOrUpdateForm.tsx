import {Checkbox, Col, Form, Input, Row} from "antd";
import React from "react";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectPackageTrial} from "@ord-components/forms/select/selectDataSource/useSelectPackage";
import {useSelectShopTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectShopTypeEnum";
import {useSelectTenantTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectTenantTypeEnum";
import {useSelectBusinessType} from "@ord-components/forms/select/selectDataSource/useSelectBusinessTypeEnum";

const TenantCreateOrUpdateForm = (prop: {
    isCreateNew: boolean
}) => {
    const { tenantListStore: mainStore } = useStore();
    const { t } = useTranslation(mainStore.getNamespaceLocale());
    const { t: tCommon } = useTranslation('common');
    const form = Form.useFormInstance();
    const code_w = Form.useWatch('code', form);
    return (<>
        <Row gutter={16}>
            <Col span={6}>
                <FloatLabel required label={t('code')}>
                    {/*sử dung code tenant  = mainShopCode */}
                    <Form.Item name='code' rules={[ValidateUtils.required, ValidateUtils.NoSpecialCharacter]} initialValue=''>
                        <Input maxLength={50} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={10}>
                <FloatLabel required label={t('name')}>
                    <Form.Item name='name' rules={[ValidateUtils.required]}>
                        <Input maxLength={200} />
                    </Form.Item>
                </FloatLabel>
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
                <FloatLabel label={t('PhoneNumber')}>
                    <Form.Item name='phoneNumber' rules={[ValidateUtils.phoneNumberVietNam]}>
                        <Input maxLength={200} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label={t('Email')}>
                    <Form.Item name='email' rules={[ValidateUtils.email]}>
                        <Input maxLength={200} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={24}>
                <FloatLabel label={tCommon('Address')}>
                    <Form.Item name='address'>
                        <Input maxLength={200} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            {
                prop.isCreateNew && code_w &&
                <>
                    <Col span={12}>
                        <FloatLabel label={t('userNameAdminTenant')} required>
                            <Form.Item name='userNameAdminTenant'
                                rules={[ValidateUtils.required, ValidateUtils.userName]}
                                initialValue={'admin'}
                            >
                                <Input addonBefore={code_w ? (code_w + '_') : ''} maxLength={200} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={12}>
                        <FloatLabel label={t('passwordAdminTenant')} required>
                            <Form.Item name='passwordAdminTenant'
                                rules={[ValidateUtils.required, ValidateUtils.password]}>
                                <Input maxLength={200} />
                            </Form.Item>
                        </FloatLabel>
                    </Col>


                </>
            }
            {prop.isCreateNew && <>
                <Col span={24} className='mb-3'>
                    <h3 className='ant-modal-title'>{t('owner')}</h3>
                </Col>
                <Col span={8}>
                    <FloatLabel label={t('OwnerName')} required>
                        <Form.Item name='ownerName' rules={[ValidateUtils.required]}>
                            <Input maxLength={200} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={8}>
                    <FloatLabel label={t('OwnerIdentityNumber')}>
                        <Form.Item name='ownerIdentityNumber'>
                            <Input maxLength={200} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={8}>
                    <FloatLabel label={t('OwnerPhone')}>
                        <Form.Item name='ownerPhone'
                            rules={[ValidateUtils.phoneNumberVietNam]}>
                            <Input maxLength={200} />
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col span={24} className='mb-3'>
                    <h3 className='ant-modal-title'>{t('mainShop')}</h3>
                </Col>
                <Col span={4} hidden>
                    <FloatLabel label={t('MainShopCode')}>
                        <Form.Item name='mainShopCode' noStyle>
                            {/*<Input maxLength={200}/>*/}
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('MainShopName')} required>
                        <Form.Item name='mainShopName'
                            rules={[ValidateUtils.required]}>
                            <Input maxLength={200} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('shopType')} required>
                        <Form.Item name='shopType' rules={[ValidateUtils.required]}>
                            <OrdSelect allowClear datasource={useSelectShopTypeEnum()}
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('businessType')} required>
                        <Form.Item name='businessType' rules={[ValidateUtils.required]}>
                            <OrdSelect allowClear datasource={useSelectBusinessType()}
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t('MainShopAddress')}>
                        <Form.Item name='mainShopAddress'>
                            <Input maxLength={200} />
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col span={12}>
                    <FloatLabel label={t('packageTrial')} required>
                        <Form.Item name='packageRegistrationId' rules={[ValidateUtils.required]}>
                            <OrdSelect allowClear datasource={useSelectPackageTrial()}
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </>}

            <Col span={6}>
                <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
                    <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                </Form.Item>
            </Col>
            {/*<Col span={6}>*/}
            {/*    <Form.Item name='isStock' valuePropName="checked" initialValue={false}>*/}
            {/*        <Checkbox>{tCommon('isStock')}</Checkbox>*/}
            {/*    </Form.Item>*/}
            {/*</Col>*/}
        </Row>
    </>);
}
export default observer(TenantCreateOrUpdateForm)
