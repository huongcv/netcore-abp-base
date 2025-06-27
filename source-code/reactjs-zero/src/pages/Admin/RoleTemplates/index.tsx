import React from "react";
import {RoleDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {useRoleLogic} from "@pages/Admin/Roles/useRoleLogic";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {ModifyModalForm} from "@ord-components/paged-table/components/ModifyModalForm";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {RoleService} from "@api/base/RoleService";
import RoleEntityForm from "@pages/Admin/Roles/EntityForm";
import {RoleSearchForm} from "@pages/Admin/Roles/SearchForm";
import {UserListModal} from "@pages/Admin/Roles/ListUsers/Modal";
import {UserListAssignableRoleModal} from "@pages/Admin/Roles/ListUserAssignable/Modal";
import {getRoleColumns} from "@pages/Admin/Roles/Columns";
import {useRoleTemplateLogic} from "@pages/Admin/RoleTemplates/useRoleLogic";
import {RoleTemplateService} from "@api/base/RoleTemplateService";

const Roles: React.FC = () => {
    const {
        topActions,
        modalStore,
        tableStore,
        crudActions,
        tableActions,
        counterFetcher
    } = useRoleTemplateLogic();
    const columns = TableUtil.getColumns<RoleDto>(getRoleColumns(), {
        actions: tableActions
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<RoleSearchForm/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={counterFetcher}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
            <ModifyModalForm
                width={800}
                modalStore={modalStore}
                tableStore={tableStore}
                entityTranslationNs="role"
                formFields={<RoleEntityForm/>}
                transformNotificationParameter={createNotificationTransform.fromMapping({
                    name: 'name'
                })}
            />
            <UserListModal/>
            <UserListAssignableRoleModal/>
        </>)
        ;
}
export default Roles;

