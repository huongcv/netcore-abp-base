import UiUtils from "@ord-core/utils/ui.utils";
import {Col, Form, Input, Row, Tree, TreeDataNode, TreeProps} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {l} from "@ord-core/language/lang.utils";
import {UserNS} from "@pages/Admin/Users/user.util";
import {ActionLazy} from "@ord-components/table/cells/ActionLazy";
import {UserDto} from "@api/index.defs";
import {UserShopService} from "@api/UserShopService";


export const AssignShopTree = (props: {
    userId?: string,
    disabled?: boolean
}) => {
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [shopAssigned, setShopAssigned] = useState<string[]>([]);
    const form = Form.useFormInstance();
    useEffect(() => {
        UserShopService.getTreeDataForAssignShop({
            strUserId: props?.userId ?? "-1"
        }).then(d => {
            setTreeData([{
                title: l.trans('permission.All'),
                key: 'root',
                children: [
                    // @ts-ignore
                    ...d.treeData
                ]
            }]);
            // @ts-ignore
            setShopAssigned([...d.shopAssigned]);
            form.setFieldValue('listShopRole', [...d.shopAssigned]);
            console.log(d.shopAssigned);
        });
    }, []);


    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        const check = checkedKeys as string[];
        form.setFieldValue('listShopRole', [...check]);
    };
    return (
        <>
            {
                treeData.length > 0 && <Tree
                    disabled={props.disabled}
                    checkable
                    defaultExpandedKeys={['root']}
                    defaultCheckedKeys={shopAssigned}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            }
            <Form.Item name='listShopRole' hidden>
                <Input/>
            </Form.Item>
        </>
    );
}

const AssignShopForm = (props: {
    userId?: string
}) => {

    const form = Form.useFormInstance();


    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        const check = checkedKeys as string[];
        form.setFieldValue('listShopRole', [...check]);
    };
    return (<Row gutter={16}>
        <Col span={12}>
            <Form.Item label={l.trans(UserNS + '.Name')} name='name'>
                <Input disabled/>
            </Form.Item></Col>
        <Col span={12}>
            <Form.Item label={l.trans('common.UserName')} name='userName'>
                <Input disabled/>
            </Form.Item>
        </Col>
        <Col span={24}>
            <AssignShopTree userId={props.userId}></AssignShopTree>
        </Col>


    </Row>);
}

class AssignShopLazy extends ActionLazy {
    icon(): React.ReactNode {
        return <CheckOutlined/>;
    }

    onClick(record: UserDto): void {
        const user = record;
        this.props.entityModalStore.openModalForm({
            modal: {
                title: l.trans(UserNS + '.AssignShop'),
                width: 600,
                style: {
                    top: 10
                }
            },
            entity: {
                ...user
            },
            formContent: (form) => (<AssignShopForm userId={user.id}/>),
            onSave: async (saveData) => {
                const result = await UserShopService.assignShopForUser({
                    body: {
                        userId: user.id,
                        listShopRole: saveData?.listShopRole
                    }
                });
                const isSuccessful = result.isSuccessful || false;
                if (isSuccessful) {
                    UiUtils.showSuccess(l.trans(UserNS + '.AssignShopSuccess', {...saveData}) as any);
                }
                return isSuccessful;
            }
        });
    }
}

export default AssignShopLazy;
