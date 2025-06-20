import {Checkbox, Col, Form, FormInstance, Input, Row, Tabs, TabsProps} from "antd";
import React from "react";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import ListPermissionInput from "@ord-components/forms/ListPermissionInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import regexUtil from "@ord-core/utils/regex.util";

const RoleCreateOrUpdateForm = (props: {
    form: FormInstance
}) => {
    const {hostRoleListStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tCommon} = useTranslation('common');
    const {mode} = mainStore.createOrUpdateModal;

    const focusRef = useAutoFocus();

    const items: TabsProps['items'] = [{
        key: '1',
        label: t('tabInfor'),
        children: (<Row gutter={18}>
            <Col span={18}>
                <FloatLabel label={t('code')}
                            required>
                    <Form.Item
                        name='code' rules={[ValidateUtils.required, ValidateUtils.maxLength(100)]}>
                        <OrdInputRegexText  regex={regexUtil.CodeRegex} />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={6}>
                <Form.Item noStyle name='isActived' valuePropName="checked" initialValue={true}>
                    <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                </Form.Item>
            </Col>
            <Col span={24}>
                <FloatLabel label={t('name')}
                            required>
                    <Form.Item
                        name='name' rules={[ValidateUtils.required]}>
                        <Input maxLength={200} ref={focusRef}/>
                    </Form.Item>
                </FloatLabel>

            </Col>
            <Col span={24}>
                <FloatLabel label={t('description')}
                            required>
                    <Form.Item required
                               name='description' rules={[ValidateUtils.required]}>
                        <Input maxLength={500}/>
                    </Form.Item>
                </FloatLabel>

            </Col>

        </Row>)
    }, {
        key: '2',
        label: t('tabPermissions'),
        children: (<Form.Item noStyle name='listPermissionName'>
            <ListPermissionInput disabled={mode === 'viewDetail'}/>
        </Form.Item>),
        forceRender: true
    }];
    return (<>
        <Tabs items={items}/>
    </>)
}
export default RoleCreateOrUpdateForm;
