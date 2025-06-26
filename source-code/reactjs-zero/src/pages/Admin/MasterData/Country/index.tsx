import React from "react";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {ModifyModalForm} from "@ord-components/paged-table/components/ModifyModalForm";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {CountryEntityForm} from "@pages/Admin/MasterData/Country/EntityForm";
import {CountryDataTableColumn, getCountryColumns} from "@pages/Admin/MasterData/Country/Columns";
import {CountryPagedDto} from "@api/base/index.defs";
import {useCountryLogic} from "./useCountryLogic";

const Country: React.FC = () => {
    const {
        tableStore,
        modalStore,
        topActions,
        tableActions,
        transformNotification,
        entityTranslationNs,
        counterService
    } = useCountryLogic();
    const columns = TableUtil.getColumns<CountryPagedDto>([
        ...getCountryColumns()
    ], {
        actions: tableActions
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<SearchFilterText span={12}/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore}
                                             statusFieldName={'isActived'}
                                             fetcher={counterService}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
            <ModifyModalForm
                width={680}
                modalStore={modalStore}
                tableStore={tableStore}
                entityTranslationNs={entityTranslationNs}
                formFields={<CountryEntityForm/>}
                transformNotificationParameter={transformNotification}
            />
        </>)
        ;
}
export default (Country);

