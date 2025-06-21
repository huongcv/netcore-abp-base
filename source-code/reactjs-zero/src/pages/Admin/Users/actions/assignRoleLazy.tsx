import {ActionLazy} from "@ord-components/table/cells/ActionLazy";
import React, {ReactNode, useEffect, useState} from "react";
import {CheckOutlined} from "@ant-design/icons";
import {RoleDto, UserDto} from "@api/index.defs";
import {UserService} from "@api/UserService";
import UiUtils from "@ord-core/utils/ui.utils";
import {UserL} from "@pages/Admin/Users/user.util";
import {Checkbox, Col, Form, Row, Tabs, TabsProps} from "antd";
import {RoleService} from "@api/RoleService";
import ListPermissionInput from "@ord-components/forms/ListPermissionInput";
import {l} from "@ord-core/language/lang.utils";
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import {useTranslation} from "react-i18next";

const AssignRoleForUserForm = () => {
    const [roleOptions, setRoleOptions] = useState<any[]>([]);
    const form = Form.useFormInstance();
    const {t} = useTranslation();

    const onChangeRoleIdSelected = (checkedValues: string[]) => {
        if (checkedValues.length > 0) {
            RoleService.getListPermission({
                body: {
                    listRoleId: (checkedValues || [])
                }
            }).then(d => {
                form.setFieldValue('listPermission', [...d]);
            })

        } else {
            form.setFieldValue('listPermission', []);
        }

    };

    useEffect(() => {
        RoleService.getPaged({
            body: {
                isActived: true,
                maxResultCount: 1000,
                skipCount: 0
            }
        }).then(result => {
            const roles: RoleDto[] = result.items || [];
            setRoleOptions(roles.map(it => {
                return {
                    value: it.id,
                    label: (<><b className='inline-block' style={{minWidth: '80px'}}>{it.code}</b> <span
                        className='italic'>{it.name}</span> </>)
                }
            }))
        })
    }, []);
    const tabItems: TabsProps['items'] = [{
        key: '1',
        label: t('ListRole'),
        children: (<>
            {roleOptions && <Col span={24}>
                <Form.Item noStyle name='listRoleId'>
                    <Checkbox.Group style={{width: '100%'}} onChange={onChangeRoleIdSelected}>
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
}

class AssignRoleLazy extends ActionLazy {
    l = UserL.l;

    icon(): ReactNode {
        return <CheckOutlined/>
    }

    async onClick(record: UserDto) {
        const {id} = record;
        const [userDto, listPermission] = await Promise.all([
            UserService.getById({
                body: {
                    userId: id,
                }
            }),
            UserService.getPermissions({
                userId: id || ''
            })]);
        this.props.entityModalStore.openModalForm({
            modal: {
                title: l.trans('user-list.assignRoleTitle', {...userDto}),
                width: 600
            },
            entity: {
                ...userDto,
                listPermission: listPermission
            },
            formContent: (form) => (<AssignRoleForUserForm/>),
            onSave: async (saveData) => {
                UiUtils.setBusy();
                try {
                    const result = await UserService.assignRole({
                        body: {
                            userId: id,
                            listRoleId: saveData?.listRoleId || [],
                            listPermission: saveData?.listPermission || [],
                        }
                    });
                    const isSuccessful = result.isSuccessful || false;
                    if (isSuccessful) {
                        UiUtils.showSuccess(this.l('AssignRoleSuccess', {...saveData}) as any);
                    }
                    return isSuccessful;
                } catch {
                    return false;
                } finally {
                    UiUtils.clearBusy();
                }


            }
        })
    }


}

export default AssignRoleLazy;
