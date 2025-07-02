import React from "react";
import {RoleDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {RoleSearchForm} from "@pages/Admin/Roles/SearchForm";
import {getRoleTemplateColumns} from "@pages/Admin/RoleTemplates/Columns";
import {useRoleTemplateLogic} from "@pages/Admin/RoleTemplates/hook/useLogic";

const Roles: React.FC = () => {
    const {
        topActions,
        tableStore,
        tableActions,
        counterService
    } = useRoleTemplateLogic();
    const columns = TableUtil.getColumns<RoleDto>(getRoleTemplateColumns(), {
        actions: tableActions
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<RoleSearchForm/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={counterService}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
        </>)
        ;
}
export default Roles;

