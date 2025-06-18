import { EmployeeDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdRadio from "@ord-components/forms/select/OrdRadio";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import DateUtil from "@ord-core/utils/date.util";
import utils from "@ord-core/utils/utils";
import { default as ValidateUtils, default as validateUtils } from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Checkbox, Col, Form, FormInstance, Input, Row, Tabs } from "antd";
import { TabsProps } from "antd/lib";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AssignShopTree } from "./actions/tenants/assignShopLazy";
import { useSelectEmployeeToAssign } from "@ord-components/forms/select/selectDataSource/useSelectEmployeeToAssign";

const UserCreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const { userSystemListStore, sessionStore } = useStore();
    const { t } = useTranslation(userSystemListStore.getNamespaceLocale());
    const { t: tCommon } = useTranslation('common');
    const [roleOptions, setRoleOptions] = useState<any[]>([]);

    const { mode, entityData } = userSystemListStore.createOrUpdateModal;

    const { form } = props;

    const focusRef = useAutoFocus();

    const actionEmployeeType_w = Form.useWatch('actionEmployeeType', form);

    const handleChangeEmployee = (option: any) => {
        let data = option.data as EmployeeDto;
        form.setFieldsValue({
            email: data.email,
            name: data.fullUserName,
            phoneNumber: data.phoneNumber,
            employeeId: data.id,
        })
    }

    const tabItems: TabsProps['items'] = [{
        key: '1',
        label: t('ListRole'),
        children: (<>
            <Col span={12}>
                <AssignShopTree
                    disabled={mode === 'viewDetail'}
                    userId={form.getFieldValue('id')}></AssignShopTree>
            </Col>
        </>)
    }];

    let employeeDatasource = useSelectEmployeeToAssign({
        userId: entityData?.id
    });

    const employeeActionSource = useSelectUserEmployeeAction();

    return (<>

        <Row gutter={8}>
            <Col span={12}>
                <FloatLabel label={tCommon('UserName')} required>
                    <Form.Item
                        tooltip={(<ul>
                            <li>{tCommon('userNameTooltip.1')}</li>
                            <li>{tCommon('userNameTooltip.2')}</li>
                            <li>{tCommon('userNameTooltip.3')}</li>
                        </ul>)}
                        name='userName' rules={[ValidateUtils.required, ValidateUtils.userName]}>
                        <Input addonBefore={(mode === 'addNew' && sessionStore.currentShopCode ? sessionStore.currentShopCode + '_' : '')}
                            ref={focusRef}
                            autoComplete="none" maxLength={30} disabled={mode !== 'addNew'} />

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
                            maxLength={100} />
                    </Form.Item>
                </FloatLabel>
            </Col>}


            {mode == 'addNew' && <Col span={24} style={{ margin: "-8px 0 10px" }}>
                <Form.Item name='actionEmployeeType' required rules={[validateUtils.required]} initialValue={1}>
                    <OrdRadio datasource={employeeActionSource} />
                </Form.Item>
            </Col>}
            <Col span={12}>
                <FloatLabel label={t('employeeName')} required>
                    <Form.Item
                        name={(actionEmployeeType_w == 1 && mode != 'update' && mode != 'viewDetail') ? 'name' : 'employeeId'} rules={[ValidateUtils.required]}>
                        {(actionEmployeeType_w == 1 && mode != 'update' && mode != 'viewDetail') ? <Input maxLength={200} /> :
                            <OrdSelect onChange={(_, option) => handleChangeEmployee(option)} datasource={employeeDatasource} />}
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label={tCommon('BirthDay')}>
                    <Form.Item
                        name='birthDay' rules={[]}>
                        <OrdDateInput disabledDate={DateUtil.disableAfterNow} disabled={actionEmployeeType_w == 2 || mode === 'update' || mode === 'viewDetail'} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={12}>
                <FloatLabel label='Email'>
                    <Form.Item name='email' rules={[ValidateUtils.email]}>
                        <Input maxLength={300} disabled={actionEmployeeType_w == 2 || mode === 'update' || mode === 'viewDetail'} />
                    </Form.Item>
                </FloatLabel>

            </Col>
            <Col span={12}>
                <FloatLabel label={tCommon('PhoneNumber')}>
                    <Form.Item
                        name='phoneNumber' rules={[ValidateUtils.phoneNumberVietNam]}>
                        <Input maxLength={10} disabled={actionEmployeeType_w == 2 || mode === 'update' || mode === 'viewDetail'} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col lg={24}>
                <Form.Item
                    name="isActived"
                    initialValue={true}
                    valuePropName="checked"
                >
                    <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
                </Form.Item>
            </Col>
        </Row>
        <div hidden>
            <Form.Item name='employeeId' />
            <Form.Item name='name' />
            <Form.Item name='id' />
        </div>
        <Tabs
            items={tabItems}
            type="card"
        />
    </>)
}
export default observer(UserCreateOrUpdateForm)

const useSelectUserEmployeeAction = (): SelectDataSource => {
    const { t } = useTranslation('user-list');
    const key = "actionEmployee";

    return useSelectDataSource(key, async () => {
        return [
            {
                value: 1,
                label: t('action.createEmployee'),
                fts: utils.toLowerCaseNonAccentVietnamese(t('action.newEmployee')),
            },
            {
                value: 2,
                label: t('action.assignEmployee'),
                fts: utils.toLowerCaseNonAccentVietnamese(t('action.assignEmployee')),
            },
        ];
    });
};

