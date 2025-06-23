import {useTranslation} from "react-i18next";
import {Col, Form, Row, Tabs, TabsProps} from "antd";
import React, {useCallback, useState} from "react";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import ListPermissionInput from "@ord-components/forms/ListPermissionInput";
import RoleCheckBox from "@pages/Admin/Users/assign-role/RoleCheckBox";

interface RoleOption {
    value: string;
    label: React.ReactNode;
}

export const AssignRoleForm = () => {
    const {t} = useTranslation();
    const [roleOptions, setRoleOptions] = useState<any[]>([]);
    const form = Form.useFormInstance();
    const handleRoleSelectionChange = useCallback(async (checkedValues: string[]) => {
        try {
            if (checkedValues.length > 0) {
                // TODO: Implement permission fetching
                // const permissions = await RoleService.getListPermission({
                //   body: {
                //     listRoleId: checkedValues
                //   }
                // });
                // form.setFieldValue('listPermission', permissions);
            } else {
                form.setFieldValue('listPermission', []);
            }
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            // TODO: Add proper error notification
        }
    }, [form]);

    const tabItems: TabsProps['items'] = [{
        key: '1',
        label: t('ListRole'),
        children: (<>
            {roleOptions && <Col span={24}>
                <Form.Item name="listRoleId" noStyle>
                    <RoleCheckBox onChange={handleRoleSelectionChange}/>
                </Form.Item>
            </Col>}
        </>)
    }, {
        key: '2',
        label: t('tabPermissions'),
        children: (<Form.Item noStyle name='listPermission'>
            <ListPermissionInput/>
        </Form.Item>),
        forceRender: true
    }];
    return (<>
        <Row gutter={18}>
            <Col span={24}>
                <OrdFormField label='Name' name='name' disabled/>
            </Col>
            <Col span={24}>
                <OrdFormField label='UserName' name='userName' disabled/>
            </Col>
            <Tabs items={tabItems}/>
        </Row>
    </>);

    return (<>
        <Form.Item name={'encodedId'} hidden noStyle></Form.Item>
        <Col span={24}>
            <OrdFormField
                name="name"
                label="FullName"
                disabled
            />
        </Col>
        <Col span={24}>
            <OrdFormField
                name="userName"
                label="UserName"
                disabled
            />
        </Col>
    </>);
}
