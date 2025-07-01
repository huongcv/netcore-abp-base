import React from "react";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {getCountryColumns} from "@pages/Admin/MasterData/Country/Columns";
import {CountryPagedDto} from "@api/base/index.defs";
import {useLogic} from "./hook/useLogic";
import {CountrySearchForm} from "@pages/Admin/MasterData/Country/SearchForm";

const Country: React.FC = () => {
    const {
        tableStore,
        topActions,
        tableActions,
        counterService
    } = useLogic();
    const columns = TableUtil.getColumns<CountryPagedDto>([
        ...getCountryColumns()
    ], {
        actions: tableActions
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<CountrySearchForm/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore}
                                             statusFieldName={'isActived'}
                                             fetcher={counterService}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
        </>)
        ;
}
export default (Country);

