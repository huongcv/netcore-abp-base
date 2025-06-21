import React from "react";
import {UserDto} from "@api/index.defs";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/PageLayoutWithTable";
import {ModifyModalForm} from "@ord-components/paged-table/ModifyModalForm";
import {UserService} from "@api/base/UserService";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import UserEntityForm from "@pages/Admin/Users/EntityForm";
import {useUserLogic} from "@pages/Admin/Users/useUserLogic";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";


const User: React.FC = () => {
    const {
        topActions,
        modalStore,
        tableStore,
        crudActions,
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
            <ModifyModalForm
                width={800}
                modalStore={modalStore}
                tableStore={tableStore}
                entityTranslationNs="user"
                formFields={<UserEntityForm/>}
                transformNotificationParameter={createNotificationTransform.fromMapping({
                    name: 'userName'
                })}
            />

        </>)
        ;
}
export default User;

