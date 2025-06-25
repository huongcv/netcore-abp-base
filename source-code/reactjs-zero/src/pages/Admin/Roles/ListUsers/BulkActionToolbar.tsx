import React from "react";
import {Button, Space} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {RolePagedDto} from "@api/base/index.defs";

interface Props {
    selectedCount: number;
    onRevokeClick: () => void;
    roleDto?: RolePagedDto | null;
}

export const UserListBulkActionToolbar: React.FC<Props> = ({selectedCount, onRevokeClick, roleDto}) => {
    const {t} = useTranslation('action');
    if (selectedCount === 0) return null;
    return (
        <>
            <Space>
                <Button disabled={selectedCount === 0} type="primary" danger icon={<DeleteOutlined/>}
                        onClick={onRevokeClick}>
                    {t('revokeUsersToRole', {selectedCount})}
                </Button>
            </Space>
        </>
    );
};


