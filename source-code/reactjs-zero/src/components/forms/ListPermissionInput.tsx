import {observer} from "mobx-react-lite";
import {Form, Tree, TreeDataNode, TreeProps} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import OrdPermissionArrayUtil from "@ord-core/utils/array/ord.permission.array.util";
import {useStore} from "@ord-store/index";
import {
    getFullPermissionByUserType,
    getFullPermissionTreeDataForUser,
    IUserLevelType
} from "@ord-core/config/permissions/tree-data";

interface IProps {
    value?: any;
    onChange?: (value: any) => void;
    disabled?: boolean;
    userType?: IUserLevelType | null;
}

const ListPermissionInput: React.FC<IProps> = (props) => {
    const {value, onChange, userType} = props;
    const {sessionStore} = useStore();
    const [granted, setGranted] = useState<string[]>([]);
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [defaultExpandedKeys, setDefaultExpandedKeys] = useState<string[]>([]);
    const form = Form.useFormInstance();

    const permissionsTreeData = useMemo(() => {
        if (!!userType) {
            return getFullPermissionByUserType(userType);
        }
        return getFullPermissionTreeDataForUser(sessionStore.appSession);
    }, [sessionStore, userType]);

    useEffect(() => {
        OrdPermissionArrayUtil.setSession(sessionStore.appSession);
        const treeDataNode = OrdPermissionArrayUtil.getTreeDataRoot(permissionsTreeData);
        setTreeData(treeDataNode);
        setDefaultExpandedKeys(['root']);
        setGranted(OrdPermissionArrayUtil.ignorePermissionBaseWhenSetGranted(value || []));
    }, [sessionStore, userType]);

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
