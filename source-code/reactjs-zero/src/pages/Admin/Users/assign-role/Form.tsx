import {useTranslation} from "react-i18next";
import {Badge, Col, Form, Tabs, TabsProps} from "antd";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import ListPermissionInput from "@ord-components/forms/ListPermissionInput";
import RoleCheckBox from "@pages/Admin/Users/assign-role/RoleCheckBox";
import {UserService} from "@api/base/UserService";

export const AssignRoleForm = () => {
    const {t} = useTranslation();
    const [roleOptions, setRoleOptions] = useState<any[]>([]);
    const form = Form.useFormInstance();
    const handlePermissionNameRoleSelectionChange = useCallback(async (permissionName: string[]) => {
        form.setFieldValue('permissionNames', [...permissionName]);
    }, [form]);
    const listPermission_w = Form.useWatch('permissionNames', form);
    const listRoleId_w = Form.useWatch('roleIds', form);
    const encodedId_w = Form.useWatch('encodedId', form);
    useEffect(() => {
        if (encodedId_w) {
            UserService.getAssignedRolesAndPermissionsAsync({
                body: {
                    encodedId: encodedId_w
                }
            }).then(res => {
                const value = res?.data;
                form.setFieldValue('permissionNames', value?.permissionNames || []);
                form.setFieldValue('roleIds', value?.roleIds || []);
            });
        }
    }, [encodedId_w]);

    // Calculate counts
    const roleCount = useMemo(() => {
        return Array.isArray(listRoleId_w) ? listRoleId_w.length : 0;
    }, [listRoleId_w]);

    const permissionCount = useMemo(() => {
        return Array.isArray(listPermission_w) ? listPermission_w.length : 0;
    }, [listPermission_w]);
    // Create tab label with counter
    const createTabLabel = useCallback((label: string, count: number) => (
        <span className="flex items-center gap-2">
            <span>{label}</span>
            <Badge
                count={count}
                showZero
                size="small"
                style={{
                    backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9',
                    color: count > 0 ? '#fff' : '#666'
                }}
            />
        </span>
    ), []);

    const tabItems: TabsProps['items'] = [{
        key: '1',
        label: createTabLabel(t('ListRole'), roleCount),
        children: (<>
            {roleOptions && <Col span={24}>
                <Form.Item name="roleIds" noStyle>
                    <RoleCheckBox userEncodedId={form.getFieldValue('encodedId')}
                                  onPermissionOfRoleSelectionChange={handlePermissionNameRoleSelectionChange}/>
                </Form.Item>
            </Col>}
        </>)
    }, {
        key: '2',
        label: createTabLabel(t('tabPermissions'), permissionCount),
        children: (<Form.Item noStyle name='permissionNames'>
            <ListPermissionInput/>
        </Form.Item>),
        forceRender: true
    }];
    return (<>
        <Form.Item name={'encodedId'} hidden noStyle></Form.Item>
        <Col span={24}>
            <OrdFormField label='full_name' name='name' disabled/>
        </Col>
        <Col span={24}>
            <OrdFormField label='UserName' name='userName' disabled/>
        </Col>
        <Tabs items={tabItems}/>
    </>);
}
