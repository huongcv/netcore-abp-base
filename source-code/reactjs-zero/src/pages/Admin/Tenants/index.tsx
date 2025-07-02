import React from "react";
import {ShopInfoDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {useTenantLogic} from "@pages/Admin/Tenants/hook/useTenantLogic";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {TenantService} from "@api/base/TenantService";
import {TenantSearchForm} from "@pages/Admin/Tenants/SearchForm";
import {getTenantColumns} from "@pages/Admin/Tenants/Columns";

const Tenants: React.FC = () => {
    const {
        topActions,
        tableStore,
        tableActions
    } = useTenantLogic();
    const columns = TableUtil.getColumns<ShopInfoDto>(
        getTenantColumns(),
        {
            actions: tableActions
        });

    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<TenantSearchForm/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={TenantService.getCountByActive}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
        </>)
        ;
}
export default Tenants;

