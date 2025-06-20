import React, {lazy} from "react";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {UserDto} from "@api/index.defs";
import {UnlockOutlined} from "@ant-design/icons";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import TableUtil from "@ord-core/utils/table.util";
import UnlockAction from "@pages/Admin/Users/actions/unlockAction";
import {UserUtil} from "@pages/Admin/Users/user.util";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/PageLayoutWithTable";
import {ModifyModalForm} from "@ord-components/paged-table/ModifyModalForm";
import {UserService} from "@api/base/UserService";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import UserEntityForm from "@pages/Admin/Users/EntityForm";
import {userCreateOrUpdateModalStore, userTableStore} from "@pages/Admin/Users/store";


const User: React.FC = () => {
    const {useHostListStore: mainStore, sessionStore} = useStore();
    const {openView, openCreate, openEdit, openDelete} = userCreateOrUpdateModalStore();
    const {onExportExcel} = userTableStore();
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
            onExportExcel().then();
        }
    },
        {
            title: 'addNew',
            permission: policies.addNew,
            onClick: () => {
                openCreate();
            },
        }];

    const columns = TableUtil.getColumns<UserDto>(UserDataColumns, {
        actions: [
            {
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
                    mainStore.openRemoveById(d);
                },
                permission: policies.remove,
                hiddenIf: (u: UserDto) => {
                    return u?.id == sessionStore.userId;
                }
            }
        ],
        ns: mainStore.getNamespaceLocale()
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<UserSearchForm/>}
                tableStore={userTableStore}>
                <OrdCounterByStatusSegmented tableStore={userTableStore} statusFieldName={'isActived'}
                                             fetcher={UserService.getCountByActive}/>
                <PagedTable columns={columns} tableStore={userTableStore}/>
            </PageLayoutWithTable>
            <ModifyModalForm
                width={680}
                modalStore={userCreateOrUpdateModalStore}
                tableStore={userTableStore}
                translationNs="user"
                formFields={<UserEntityForm/>}
            />

        </>)
        ;
}
export default User;

