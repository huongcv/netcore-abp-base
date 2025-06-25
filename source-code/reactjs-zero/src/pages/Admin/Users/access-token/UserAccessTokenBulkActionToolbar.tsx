import React from "react";
import {Button, Space} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

interface Props {
    selectedCount: number;
    onRevokeClick: () => void;
}

export const UserAccessTokenBulkActionToolbar: React.FC<Props> = ({selectedCount, onRevokeClick}) => {
    const {t: tCommon} = useTranslation();

    if (selectedCount === 0) return null;

    return (
        <div style={{
            marginBottom: 16,
            padding: '12px 16px',
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Space>
                <span style={{fontWeight: 500}}>
                    {tCommon('selectedItems', {count: selectedCount})}
                </span>
            </Space>

            <Space>
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onRevokeClick}
                >
                    {tCommon('revokeSelected', {count: selectedCount})}
                </Button>
            </Space>
        </div>
    );
};
