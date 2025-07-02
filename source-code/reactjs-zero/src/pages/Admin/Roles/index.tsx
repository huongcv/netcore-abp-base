import React from "react";
import {RoleDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {useRoleLogic} from "@pages/Admin/Roles/hook/useRoleLogic";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {RoleService} from "@api/base/RoleService";
import {RoleSearchForm} from "@pages/Admin/Roles/SearchForm";
import {getRoleColumns} from "@pages/Admin/Roles/Columns";

const Roles: React.FC = () => {
    const {
        topActions,
        tableStore,
        tableActions
    } = useRoleLogic();


    const columns = TableUtil.getColumns<RoleDto>(getRoleColumns(()=>{
        tableStore.getInitialState().onLoadData();
    }), {
        actions: tableActions
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<RoleSearchForm/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={RoleService.getCountByActive}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
        </>)
        ;
}
export default Roles;

