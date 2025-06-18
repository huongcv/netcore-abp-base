import { UnlockOutlined } from "@ant-design/icons";
import { UserDto } from "@api/index.defs";
import { UserService } from "@api/UserService";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import UnlockAction from "@pages/System/Users/actions/unlockAction";
import UserCreateOrUpdateForm from "@pages/System/Users/CreateOrUpdateForm";
import { UserUtil } from "@pages/System/Users/user.util";
import { UserDataColumns } from "@pages/System/Users/UserDataColumns";
import { UserSearchForm } from "@pages/System/Users/UserSearchForm";
import React, { lazy } from "react";


const User: React.FC = () => {
    const {userSystemListStore, sessionStore} = useStore();
    const policies = {
        base: 'AuthPlugin.User',
        addNew: 'AuthPlugin.User.Create',
        edit: 'AuthPlugin.User.Update',
        remove: 'AuthPlugin.User.Remove',
        resetPassword: 'AuthPlugin.User.ResetPassword',
        assignRole: 'AuthPlugin.User.AssignRole',
        loginWithAccount: 'AuthPlugin.User.LoginPasswordless'
    };
    const topActions: IActionBtn[] = [{
        title: 'exportExcel',
        permission: policies.base,
        onClick: () => {
            userSystemListStore.exportExcelPagedResult().then();
        }
    },
        {
            title: 'addNew',
            permission: policies.addNew,
            onClick: () => {
                userSystemListStore.openCreateModal();
            },
        }];

    const columns = TableUtil.getColumns<UserDto>(UserDataColumns, {
        actions: [
            // ...([
            //     {
            //         title: 'assignRole',
            //         permission: policies.assignRole,
            //         contentLazy: lazy(() => import("./actions/assignRoleLazy"))
            //     }
            // ]),
            {
                title: 'changePassword',
                permission: policies.resetPassword,
                contentLazy: lazy(() => import("./actions/changePwdAction")),
                hiddenIf: (u: UserDto) => {
                    return u?.id == sessionStore.userId;
                }
            },
            {
                title: 'unlockUser',
                icon: <UnlockOutlined/>,
                permission: policies.edit,
                content: (user) => <UnlockAction user={user}/>,
                hiddenIf: (value: UserDto) => {
                    return !UserUtil.isLocked(value);
                },
            },
            {
                title: 'loginWithAccount',
                permission: policies.loginWithAccount,
                contentLazy: lazy(() => import("./actions/loginWithAccount")),
                hiddenIf: (u: UserDto) => {
                    return u?.id == sessionStore.userId;
                }
            },
            {
                title: 'remove',
                onClick: (d) => {
                    userSystemListStore.openRemoveById(d);
                },
                permission: policies.remove,
                hiddenIf: (u: UserDto) => {
                    return u?.id == sessionStore.userId;
                }
            }
        ],
        viewAction: (d: UserDto) => {
            userSystemListStore.openUpdateModal(d);
        },
        ns: userSystemListStore.getNamespaceLocale()
    });
    return (
        <>
            <OrdCrudPage stored={userSystemListStore}
                         topActions={topActions}
                         columns={columns}
                         contentTopTable={
                                   <IsActiveStatusCounter getCountApi={UserService.getCount} />
                                 }
                         searchForm={(searchFormRef) => <UserSearchForm searchFormRef={searchFormRef}/>}
                         entityForm={form => <UserCreateOrUpdateForm form={form}/>}
            ></OrdCrudPage>
        </>)
}
export default User;

