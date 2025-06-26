import {useMemo, useState} from "react";
import {RolePagedDto} from "@api/base/index.defs";
import {useTranslation} from "react-i18next";
import {useRowSelectionStore} from "@ord-components/paged-table/hooks/useRowSelectionStore";
import {Form} from "antd";
import {RoleService} from "@api/base/RoleService";
import {formSignalUtils} from "@ord-components/paged-table/utils/formSignal.utils";
import {useApiActionHandler} from "@ord-core/hooks/useApiActionHandler";
import {userListModalAssignableRoleStore} from "@pages/Admin/Roles/ListUserAssignable/Modal";

export const useUserListAssignableRoleLogic = (roleDto?: RolePagedDto | null) => {
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
    // ✅ Memoize apiService để tránh re-create object mỗi lần render
    const apiService = useMemo(() => ({
        getPaged: (params: any, options?: any) => {
            const body = params?.body;
            return RoleService.getUsersAssignableToRole({
                body: {
                    encodedId: roleDto?.encodedId,
                    ...body
                }
            })
        }
    }), [roleDto?.encodedId]);
    const handleBulkAssign = async (callBack: () => void) => {
        executeApiAction(
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
                    clearSelection();
                    formSignalUtils.reloadTableOnly(searchForm);
                    callBack();
                }
            }
        );
    };

    return {
        apiService,
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection,
        openConfirm,
        setOpenConfirm,
        handleBulkAssign,
        searchForm
    };
};
