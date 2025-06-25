import React from "react";
import {Button, Space} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

interface Props {
    selectedCount: number;
    onClick: () => void;
}

export const UserListBulkAssignableToRoleActionToolbar: React.FC<Props> = ({selectedCount, onClick}) => {
    const {t} = useTranslation('action');
    if (selectedCount === 0) return null;
    return (
        <Space>
            <Button disabled={selectedCount === 0} type="primary" icon={<CheckCircleOutlined/>} onClick={onClick}>
                {t('bulkUserAssignableToRole', {selectedCount})}
            </Button>

        </Space>
    );
};
