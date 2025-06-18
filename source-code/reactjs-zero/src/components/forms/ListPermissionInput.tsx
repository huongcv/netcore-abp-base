import {observer} from "mobx-react-lite";
import {Form, Tree, TreeDataNode, TreeProps} from "antd";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import OrdArrayUtil from "@ord-core/utils/array/ord.permission.array.util";
import OrdPermissionArrayUtil from "@ord-core/utils/array/ord.permission.array.util";
import {useStore} from "@ord-store/index";


const ListPermissionInput = (props: {
    value?: any;
    onChange?: (value: any) => void;
    disabled?: boolean;
    forUpsertRoleTenant?: boolean;
}) => {
    const {value, onChange, forUpsertRoleTenant} = props;
    const {sessionStore} = useStore();
    const {t} = useTranslation('permission');
    const [granted, setGranted] = useState<string[]>([]);
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<string[]>([]);
    const form = Form.useFormInstance();
    const formCode_w = Form.useWatch('code', form);
    useEffect(() => {
        console.log(formCode_w);
        setTreeData(OrdArrayUtil.getTreeDataRoot(sessionStore.appSession, formCode_w, forUpsertRoleTenant));
        setDefaultExpandedKeys(['root']);
        setGranted(OrdPermissionArrayUtil.ignorePermissionBaseWhenSetGranted(value || []));
    }, [formCode_w]);
    
    useEffect(() => {
        // @ts-ignore
        setGranted(OrdPermissionArrayUtil.ignorePermissionBaseWhenSetGranted(value || []));
    }, [value]);
    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        const granted = checkedKeys as string[];
        onChange?.(granted.filter(s => s !== 'root' && !s.startsWith('group')));
    };
    return (<>{
        (treeData.length > 0 && granted) &&
        <Tree
            disabled={props?.disabled}
            checkable
            defaultExpandedKeys={defaultExpandedKeys}
            checkedKeys={granted}
            onCheck={onCheck}
            treeData={treeData}
        />
    }</>);
}
export default observer(ListPermissionInput)
