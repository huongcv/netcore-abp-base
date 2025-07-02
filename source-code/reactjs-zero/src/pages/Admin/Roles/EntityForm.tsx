import {Col, Form, Input, Row, Tabs, TabsProps} from "antd";
import React, {useMemo} from "react";
import ValidateUtils from "@ord-core/utils/validate.utils";
import ListPermissionInput from "@ord-components/forms/ListPermissionInput";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import regexUtil from "@ord-core/utils/regex.util";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import {useTranslation} from "react-i18next";

const RoleEntityForm = () => {
    const {t} = useTranslation('common');
    const focusRef = useAutoFocus();
    const modifyMode = Form.useWatch(['extendUi', 'modifyMode']);
    const isReadOnly = useMemo(() => {
        return modifyMode == 'view'
    }, [modifyMode]);
    const isAdd = useMemo(() => {
        return modifyMode == 'add'
    }, [modifyMode]);
    const items: TabsProps['items'] = [{
        key: '1',
        label: t('detailInformation'),
        children: (<Row gutter={18}>
            <Col span={12}>
                <OrdFormField label={'code'} name={'code'} required
                              rules={[ValidateUtils.required, ValidateUtils.maxLength(100)]}>
                    <OrdInputRegexText regex={regexUtil.CodeRegex} ref={focusRef}/>
                </OrdFormField>
            </Col>

            <Col span={12}>
                <OrdFormField label={'name'} name={'name'} required
                              rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}>
                    <Input maxLength={200}/>
                </OrdFormField>
            </Col>
            <Col span={24}>
                <OrdFormField label={'description'} name={'description'}
                              rules={[ValidateUtils.maxLength(500)]}>
                    <Input maxLength={500}/>
                </OrdFormField>
            </Col>
            <Col span={24}>
                <OrdFormField label='dang_hoat_dong' name='isActived' isCheckbox initialValue={true}/>
            </Col>
        </Row>)
    }, {
        key: '2',
        label: t('tabPermissions'),
        children: (<Form.Item noStyle name='permissionNames'>
            <ListPermissionInput disabled={isReadOnly}/>
        </Form.Item>),
        forceRender: true
    }];
    return (<>
        <Tabs items={items}/>
    </>)
}
export default RoleEntityForm;
