import React, {useMemo} from "react";
import {Button, Space} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {RolePagedDto} from "@api/base/index.defs";
import {ApiActionHandler} from "@ord-core/utils/api/api-action.handler";
import {RoleService} from "@api/base/RoleService";
import {l} from "@ord-core/language/lang.utils";

interface Props {
    selectedRowKeys: string[];
    roleDto: RolePagedDto;
    onSaved: () => void;
}

export const BulkRevokeRoleActionToolbar: React.FC<Props> = ({
                                                                 selectedRowKeys,
                                                                 roleDto,
                                                                 onSaved
                                                             }) => {
    const {t} = useTranslation('action');
    const selectedCount = useMemo(() => {
        return (selectedRowKeys || []).length;
    }, [selectedRowKeys])
    if (selectedCount <= 0) return null;

    const onRevokeClick = async () => {
        ApiActionHandler.execute(
            () => {
                const userIds = selectedRowKeys.map((rowKey) => rowKey + '');
                return RoleService.removeUsersFromRole({
                    body: {
                        encodedId: roleDto?.encodedId,
                        userIds
                    }
                });
            },
            {
                successMessage: l.trans('confirm.revokeRole.success'),
                successMessagePrm: {
                    count: selectedRowKeys.length,
                },
                afterSuccess: (data) => {
                    onSaved();
                }
            }
        );
    };
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


