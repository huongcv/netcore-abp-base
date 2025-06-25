// pages/Admin/MasterData/Country/useCountryLogic.ts
import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";
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
// Stores
const tableStore = createTableStore(UserService);
const modalStore = createModalFormStore(UserService, {});


export const useUserLogic = () => {
    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    const {sessionStore} = useStore();
    const {openModal: openModalChangePassword} = changePasswordUserModalStore();
    const {openModal: openModalAssignRole} = assignRoleUserModalStore();
    const {openModal: openModalAccessToken} = userAccessTokenListModalStore();
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
            onClick: openCreate
        }
    ];
    const tableActions: ITableAction<UserDetailDto>[] = [{
        title: 'view',
        onClick: (d) => {
            openView(d);
        }
    },
        {
            title: 'edit',
            onClick: (d) => {
                openEdit(d);
            }
        },
        {
            title: 'changePassword',
            permission: USER_POLICIES.RESET_PASSWORD,
            icon: <UndoOutlined/>,
            onClick: (user) => {
                openModalChangePassword(user);
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
                openModalAssignRole(user);
            },
        },
        {
            title: 'accessTokenList',
            icon: <KeyOutlined/>,
            permission: USER_POLICIES.MANAGE_ACCESS_TOKEN,
            onClick: (user) => {
                openModalAccessToken(user);
            },
        },
        {
            title: 'remove',
            onClick: (d) => {
                openDelete(d);
            },
            permission: USER_POLICIES.REMOVE,
            hiddenIf: (u: UserDto) => {
                return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
            }
        }];

    return {
        tableStore,
        modalStore,
        topActions,
        tableActions,
        crudActions: {
            openView,
            openCreate,
            openEdit,
            openDelete,
            onExportExcel
        }
    };
};