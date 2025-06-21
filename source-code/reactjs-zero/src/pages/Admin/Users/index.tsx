import React, {lazy} from "react";
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
import {userTableStore} from "@pages/Admin/Users/store";
import {useUserLogic} from "@pages/Admin/Users/useUserLogic";


const User: React.FC = () => {
    const {
        actions,
        topActions,
        modalStore,
        tableStore,
        policies
    } = useUserLogic();
    const {useHostListStore: mainStore, sessionStore} = useStore();
    const {openView, openCreate, openEdit, openDelete} = modalStore();
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
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={UserService.getCountByActive}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
            <ModifyModalForm
                width={680}
                modalStore={modalStore}
                tableStore={tableStore}
                translationNs="user"
                formFields={<UserEntityForm/>}
            />

        </>)
        ;
}
export default User;

