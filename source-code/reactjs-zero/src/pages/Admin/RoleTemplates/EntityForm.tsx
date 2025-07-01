import {Form, Tabs, TabsProps} from "antd";
import React, {useMemo} from "react";
import ListPermissionInput from "@ord-components/forms/ListPermissionInput";
import {useTranslation} from "react-i18next";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {useUserTypeFromRoleCode} from "@pages/Admin/RoleTemplates/hook/useUserTypeFromRoleCode";

export const RoleTemplateEntityForm: React.FC = () => {
    const {t} = useTranslation('common');
    const form = Form.useFormInstance();
    const modifyMode = Form.useWatch(['extendUi', 'modifyMode']);
    const userType = useUserTypeFromRoleCode(Form.useWatch('code', form));
    const isReadOnly = useMemo(() => {
        return modifyMode == 'view'
    }, [modifyMode]);
    const isAdd = useMemo(() => {
        return modifyMode == 'add'
    }, [modifyMode]);
    const config = useMemo(() => {
        return new FormBuilder()
            .addText({
                span: 12,
                name: 'code',
                maxLength: 100,
                required: true,
                disabled: !isAdd
            })
            .addText({
                span: 12,
                name: 'name',
                maxLength: 200,
                required: true
            }).addTextArea({
                span: 24,
                name: 'description',
                maxLength: 500
            }).addCheckbox({
                name: 'isActived',
                initialValue: true
            })
            .build();
    }, [isAdd]);


    const items: TabsProps['items'] = [{
        key: '1',
        label: t('detailInformation'),
        children: (<>
            <OrdFormBuilder config={config}/>
        </>)
    }, {
        key: '2',
        label: t('tabPermissions'),
        children: (<Form.Item noStyle name='permissionNames'>
            <ListPermissionInput disabled={isReadOnly} userType={userType}/>
        </Form.Item>),
        forceRender: true
    }];
    return (<>
        <Tabs items={items}/>
    </>)
}
