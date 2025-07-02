import React, {useMemo} from "react";
import {Button, Space} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {RoleService} from "@api/base/RoleService";
import {ApiActionHandler} from "@ord-core/utils/api/api-action.handler";
import {RolePagedDto} from "@api/base/index.defs";

interface Props {
    selectedRowKeys: string[];
    roleDto: RolePagedDto;
    onSaved: () => void;
}

export const BulkAssignableToRoleActionToolbar: React.FC<Props> = (
    {
        selectedRowKeys,
        roleDto,
        onSaved
    }) => {
    const {t} = useTranslation('action');
    const selectedCount = useMemo(() => {
        return (selectedRowKeys || []).length;
    }, [selectedRowKeys])
    if (selectedCount <= 0) return null;
    const handleBulkAssign = async () => {
        ApiActionHandler.execute(
            () => {
                const userIds = selectedRowKeys.map((rowKey) => rowKey + '');
                return RoleService.addUsersToRole({
                    body: {
                        encodedId: roleDto?.encodedId,
                        userIds
                    }
                });
            },
            {
                successMessage: 'common.addUsersToRoleSuccess',
                successMessagePrm: {
                    count: selectedRowKeys.length,
                    roleName: roleDto?.name
                },
                afterSuccess: (data) => {
                    onSaved();
                }
            }
        );
    };

    return (
        <Space>
            <Button disabled={selectedCount === 0}
                    type="primary"
                    icon={<CheckCircleOutlined/>}
                    onClick={handleBulkAssign}>
                {t('bulkUserAssignableToRole', {selectedCount})}
            </Button>

        </Space>
    );
};
