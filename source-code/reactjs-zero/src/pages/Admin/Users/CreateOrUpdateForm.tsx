import {RoleDto} from "@api/index.defs";
import {RoleHostService} from "@api/RoleHostService";
import {RoleService} from "@api/RoleService";
import {UserHostService} from "@api/UserHostService";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import DateUtil from "@ord-core/utils/date.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useStore} from "@ord-store/index";
import {Checkbox, Col, Form, FormInstance, Input, Row, TabsProps} from "antd";
import {Tabs} from "antd/lib";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const UserCreateOrUpdateForm = () => {
    const {useHostListStore: mainStore, sessionStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tCommon} = useTranslation('common');
    const {mode} = mainStore.createOrUpdateModal;
    const form = Form.useFormInstance();

    const [roleOptions, setRoleOptions] = useState<any[]>([]);

    const tabItems: TabsProps['items'] = [{
        key: '1',
        label: t('ListRole'),
        children: (<>
            {roleOptions && <Col span={24}>
                <Form.Item name='listRoleId'>
                    <Checkbox.Group style={{width: '100%'}}>
                        <Row gutter={16}>
                            {roleOptions.map((opt) => {
                                return (<Col className='mb-1' key={opt.value} span={24}>
                                    <Checkbox value={opt.value}>{opt.label}</Checkbox>
                                </Col>);
                            })}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
            </Col>}
        </>)
    },
    ];


    useEffect(() => {
        UserHostService.getTreeDataForUserHost({
            strUserId: form.getFieldValue('id')
        }).then(result => {
            const lstRole = result.roleTreeData;
            const lstRoleAssignIds = result.listRoleAssignId;
            if (lstRole?.length) {
                setRoleOptions(lstRole.map(it => {
                    return {
                        value: it.id,
                        label: (<><b className='inline-block' style={{minWidth: '80px'}}>{it.code}</b> <span
                            className='italic'>{it.name}</span> </>)
                    }
                }))
            }
            if (lstRoleAssignIds?.length) {
                form.setFieldValue('listRoleId', lstRoleAssignIds);
            }
        })
    }, []);


    return (<>
        <Row gutter={18}>
            <Col span={12}>
                <FloatLabel label={tCommon('UserName')} required>
                    <Form.Item
                        tooltip={(<ul>
                            <li>{tCommon('userNameTooltip.1')}</li>
                            <li>{tCommon('userNameTooltip.2')}</li>
                            <li>{tCommon('userNameTooltip.3')}</li>
                        </ul>)}
                        name='userName' rules={[ValidateUtils.required, ValidateUtils.userName]}>
                        <Input
                            addonBefore={(mode === 'addNew' && sessionStore.tenantCode ? sessionStore.tenantCode + '_' : '')}
                            autoComplete="none" maxLength={30} disabled={mode !== 'addNew'}/>

                    </Form.Item>
                </FloatLabel>

            </Col>
            {mode !== 'viewDetail' && <Col span={12}>
                <FloatLabel label={tCommon('Password')} required={mode === 'addNew'}>
                    <Form.Item
                        name='password'
                        rules={[mode === 'addNew' ? ValidateUtils.required : ValidateUtils.alwaysValid, ValidateUtils.password]}>
                        <Input autoComplete="none"
                               placeholder={mode === 'update' ? t('emptyIfNotChangePassword') : ''}
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

        <Tabs items={tabItems}/>

        <div hidden>
            <Form.Item name={'id'}/>
        </div>
    </>)
}
export default observer(UserCreateOrUpdateForm)
