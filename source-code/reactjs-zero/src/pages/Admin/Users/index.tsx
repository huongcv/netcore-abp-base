import React, {lazy} from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {UserDto} from "@api/index.defs";
import UserCreateOrUpdateForm from "@pages/Admin/Users/CreateOrUpdateForm";
import {UnlockOutlined} from "@ant-design/icons";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import TableUtil from "@ord-core/utils/table.util";
import UnlockAction from "@pages/Admin/Users/actions/unlockAction";
import {UserUtil} from "@pages/Admin/Users/user.util";
import {createTableStore, PagedTable} from "@ord-components/paged-table";
import {CountryService} from "@api/base/CountryService";
import {PagedTableSearchForm} from "@ord-components/paged-table/PagedTableSearchForm";
import {PageLayoutWithTable} from "@ord-components/paged-table/PageLayoutWithTable";
import {ModifyModalForm} from "@ord-components/paged-table/ModifyModalForm";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";

const userTableStore = createTableStore();
const modalStore = createModalFormStore(CountryService, {

});
const User: React.FC = () => {
    const {useHostListStore: mainStore, sessionStore} = useStore();
    const {openCreate, openEdit, openView} = modalStore();
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
            mainStore.exportExcelPagedResult().then();
        }
    },
        {
            title: 'addNew',
            permission: policies.addNew,
            onClick: () => {
                mainStore.openCreateModal();
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
        viewAction: (d) => {
            mainStore.openUpdateModal(d)
        },
        ns: mainStore.getNamespaceLocale()
    });
    return (
        <>
            <OrdCrudPage stored={mainStore}
                         topActions={topActions}
                         columns={columns}
                         searchForm={(searchFormRef) => <UserSearchForm/>}
                         entityForm={form => <UserCreateOrUpdateForm/>}
            ></OrdCrudPage>
            <PageLayoutWithTable
                searchForm={<PagedTableSearchForm tableStore={userTableStore} searchFields={<UserSearchForm/>}/>}
                tableContent={<PagedTable columns={columns} fetcher={CountryService.getPaged}
                                          tableStore={userTableStore}/>}
            />
            <ModifyModalForm
                modalStore={modalStore}
                translationNs="user"
                formFields={
                    <>
                        <UserCreateOrUpdateForm/>
                    </>
                }
            />

        </>)
        ;
}
export default User;

