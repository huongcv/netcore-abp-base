// pages/Admin/MasterData/Country/useCountryLogic.ts
import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/hooks/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {UserService} from "@api/base/UserService";
import {USER_POLICIES} from "@pages/Admin/Users/user.constants";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {UserDetailDto} from "@api/base/index.defs";
import React, {useCallback} from "react";
import {UserDto} from "@api/index.defs";
import {UserUtilities} from "@pages/Admin/Users/user.util";
import {CheckOutlined, KeyOutlined, LoginOutlined, UndoOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {changePasswordUserModalStore} from "@pages/Admin/Users/change-password/Modal";
import {assignRoleUserModalStore} from "@pages/Admin/Users/assign-role/Modal";
import {UserImpersonationService} from "@api/base/UserImpersonationService";
import {userAccessTokenListModalStore} from "@pages/Admin/Users/access-token/Modal";
import {useUserModifyModal} from "@pages/Admin/Users/hook/useModifyModal";
// Stores
const tableStore = createTableStore(UserService);


export const useUserLogic = () => {
    const {onExportExcel, onLoadData, setReloadStatusCounter} = tableStore();
    const {sessionStore} = useStore();
    // Modal actions
    const {openCreateModal, openEditModal, openDeleteConfirm, openViewModal} = useUserModifyModal(() => {
        onLoadData();
        setReloadStatusCounter();
    });
    // Memoized handlers để tránh re-render
    const handleExportExcel = useCallback(async () => {
        try {
            await onExportExcel();
        } catch (error) {
        }
    }, [onExportExcel]);

    const handleImpersonation = useCallback(async (record: UserDetailDto) => {
        try {
            await UserImpersonationService.loginAsUser({
                body: {encodedId: record.encodedId}
            });
            location.href = '/';
        } catch (error) {
        }
    }, []);

    // Top actions
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: USER_POLICIES.BASE,
            onClick: handleExportExcel
        },
        {
            title: 'addNew',
            permission: USER_POLICIES.CREATE,
            onClick: openCreateModal
        }
    ];
    const tableActions: ITableAction<UserDetailDto>[] = [{
        title: 'view',
        onClick: (d) => {
            openViewModal(d);
        }
    },
        {
            title: 'edit',
            onClick: (d) => {
                openEditModal(d);
            }
        },
        {
            title: 'changePassword',
            permission: USER_POLICIES.RESET_PASSWORD,
            icon: <UndoOutlined/>,
            onClick: (user) => {
                changePasswordUserModalStore.getInitialState().openModal(user);
            },
            hiddenIf: (u: UserDto) => {
                return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
            }
        },
        // {
        //     title: 'unlockUser',
        //     icon: <UnlockOutlined/>,
        //     permission: USER_POLICIES.UPDATE,
        //     content: (user) => <UnlockAction user={user}/>,
        //     hiddenIf: (value: UserDto) => {
        //         return !UserUtilities.isLocked(value);
        //     },
        // },
        {
            title: 'loginWithAccount',
            permission: USER_POLICIES.LOGIN_WITH_ACCOUNT,
            icon: <LoginOutlined/>,
            onClick: handleImpersonation
        },
        {
            title: 'assignRole',
            icon: <CheckOutlined/>,
            permission: USER_POLICIES.ASSIGN_ROLE,
            onClick: (user) => {
                assignRoleUserModalStore.getInitialState().openModal(user);
            },
        },
        {
            title: 'accessTokenList',
            icon: <KeyOutlined/>,
            permission: USER_POLICIES.MANAGE_ACCESS_TOKEN,
            onClick: (user) => {
                userAccessTokenListModalStore.getInitialState().openModal(user);
            },
        },
        {
            title: 'remove',
            onClick: (d) => {
                openDeleteConfirm(d);
            },
            permission: USER_POLICIES.REMOVE,
            hiddenIf: (u: UserDto) => {
                return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
            }
        }];

    return {
        tableStore,
        topActions,
        tableActions
    };
};