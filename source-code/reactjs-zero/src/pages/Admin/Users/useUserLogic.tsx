// pages/Admin/MasterData/Country/useCountryLogic.ts
import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {UserService} from "@api/base/UserService";
import {USER_POLICIES} from "@pages/Admin/Users/user.constants";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {UserDetailDto} from "@api/base/index.defs";
import React, {lazy} from "react";
import {UserDto} from "@api/index.defs";
import {UserUtilities} from "@pages/Admin/Users/user.util";
import {UnlockOutlined} from "@ant-design/icons";
import UnlockAction from "@pages/Admin/Users/actions/unlockAction";
import {useStore} from "@ord-store/index";
// Stores
const tableStore = createTableStore(UserService);
const modalStore = createModalFormStore(UserService, {});


export const useUserLogic = () => {
    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    const {sessionStore} = useStore();
    // Top actions
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: USER_POLICIES.BASE,
            onClick: () => {
                onExportExcel().then();
            }
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
            contentLazy: lazy(() => import("./actions/changePwdAction")),
            hiddenIf: (u: UserDto) => {
                return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
            }
        },
        {
            title: 'unlockUser',
            icon: <UnlockOutlined/>,
            permission: USER_POLICIES.UPDATE,
            content: (user) => <UnlockAction user={user}/>,
            hiddenIf: (value: UserDto) => {
                return !UserUtilities.isLocked(value);
            },
        },
        {
            title: 'loginWithAccount',
            permission: USER_POLICIES.LOGIN_WITH_ACCOUNT,
            contentLazy: lazy(() => import("./actions/loginWithAccount")),
            hiddenIf: (u: UserDto) => {
                return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
            }
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