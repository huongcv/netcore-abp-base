import React from "react";
import {UserDto} from "@api/index.defs";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {UserService} from "@api/base/UserService";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {useUserLogic} from "@pages/Admin/Users/hook/useUserLogic";
import {ChangePasswordUserModal} from "@pages/Admin/Users/change-password/Modal";
import {AssignRoleUserModal} from "@pages/Admin/Users/assign-role/Modal";
import {UserAccessTokenListModal} from "@pages/Admin/Users/access-token/Modal";


const User: React.FC = () => {
    const {
        topActions,
        tableStore,
        tableActions
    } = useUserLogic();
    const columns = TableUtil.getColumns<UserDto>(UserDataColumns, {
        actions: tableActions
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
            <ChangePasswordUserModal/>
            <AssignRoleUserModal/>
            <UserAccessTokenListModal/>
        </>)
        ;
}
export default User;

