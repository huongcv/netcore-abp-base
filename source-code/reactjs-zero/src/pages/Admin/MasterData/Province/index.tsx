import React from "react";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {getCountryColumns} from "@pages/Admin/MasterData/Country/Columns";
import {CountryPagedDto} from "@api/base/index.defs";
import {CountrySearchForm} from "@pages/Admin/MasterData/Country/SearchForm";
import {useProvinceLogic} from "@pages/Admin/MasterData/Province/useLogic";

const Province: React.FC = () => {
    const {
        tableStore,
        topActions,
        tableActions,
        counterService
    } = useProvinceLogic();
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
export default (Province);

