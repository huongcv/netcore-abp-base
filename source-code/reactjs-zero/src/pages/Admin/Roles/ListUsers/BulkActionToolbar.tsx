import React from "react";
import {Button, Popconfirm, Space} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {RolePagedDto} from "@api/base/index.defs";
import {OrdTransConfirm} from "@ord-components/common/translation/OrdTransConfirm";

interface Props {
    selectedCount: number;
    onRevokeClick: () => void;
    roleDto?: RolePagedDto | null;
}

export const UserListBulkActionToolbar: React.FC<Props> = ({selectedCount, onRevokeClick, roleDto}) => {
    const {t: tCommon} = useTranslation('confirm');

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
                    <OrdTransConfirm i18nKey={'revokeRole.selectedItems'} values={{count: selectedCount}}/>
                </span>
            </Space>

            <Space>
                <Popconfirm
                    title={<OrdTransConfirm i18nKey={'revokeRole.title'}/>}
                    description={<div style={{width: 300}}>
                        <OrdTransConfirm ns={'confirm'} i18nKey="revokeRole.description"
                                         values={{
                                             count: selectedCount,
                                             ...roleDto
                                         }}/>
                    </div>}
                    onConfirm={onRevokeClick}
                    okText={<OrdTransConfirm i18nKey={'okText'}/>}
                    cancelText={<OrdTransConfirm i18nKey={'cancelText'}/>}
                >
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined/>}
                    >
                        <OrdTransConfirm i18nKey={'revokeRole.button'} values={{count: selectedCount}}/>
                    </Button>
                </Popconfirm>

            </Space>
        </div>
    );
};
