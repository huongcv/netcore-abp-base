import {useState} from "react";
import {RolePagedDto} from "@api/base/index.defs";
import {useTranslation} from "react-i18next";
import {useRowSelectionStore} from "@ord-components/paged-table/hooks/useRowSelectionStore";
import {Form} from "antd";
import {RoleService} from "@api/base/RoleService";
import {formSignalUtils} from "@ord-components/paged-table/utils/formSignal.utils";
import {useApiActionHandler} from "@ord-core/hooks/useApiActionHandler";

export const useUserListOfRoleLogic = (roleDto?: RolePagedDto | null) => {
    const {t} = useTranslation("confirm");
    const [openConfirm, setOpenConfirm] = useState(false);
    const {executeApiAction} = useApiActionHandler();
    const [searchForm] = Form.useForm();
    const {
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection,
    } = useRowSelectionStore<RolePagedDto>({});

    const handleBulkRevoke = async () => {
        executeApiAction(
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
                successMessage: 'confirm.revokeRole.success',
                successMessagePrm: {
                    count: selectedRowKeys.length,
                },
                afterSuccess: (data) => {
                    clearSelection();
                    formSignalUtils.reloadTableOnly(searchForm);
                }
            }
        );
    };

    return {
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection,
        openConfirm,
        setOpenConfirm,
        handleBulkRevoke,
        searchForm
    };
};
