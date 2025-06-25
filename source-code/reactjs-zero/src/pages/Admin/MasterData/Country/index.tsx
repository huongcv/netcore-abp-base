import React from "react";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTable} from "@ord-components/paged-table";
import {useCrudModalStore} from "@ord-components/paged-table/hooks/useModalFormStoreFactory";
import {CountryService} from "@api/base/CountryService";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {ModifyModalForm} from "@ord-components/paged-table/components/ModifyModalForm";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {CountryEntityForm} from "@pages/Admin/MasterData/Country/EntityForm";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {CountryDataTableColumn} from "@pages/Admin/MasterData/Country/Columns";
import {useTableStore} from "@ord-components/paged-table/hooks/useTableStore";
import {CountryPagedDto} from "@api/base/index.defs";

const Country: React.FC = () => {
    const tableStore = useTableStore(CountryService);
    const modalStore = useCrudModalStore(CountryService);
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    const {onExportExcel} = tableStore();
    const columns = TableUtil.getColumns<CountryPagedDto>([
        ...CountryDataTableColumn
    ], {
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
                title: 'remove',
                onClick: (d) => {
                    openDelete(d);
                }
            }
        ]
    });
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: 'MasterData.Country',
            onClick: () => {
                onExportExcel().then();
            }
        },
        {
            title: 'addNew',
            permission: 'MasterData.Country.Create',
            onClick: () => {
                openCreate();
            }
        }
    ];
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<SearchFilterText span={12}/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={CountryService.getCountByActive}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
            <ModifyModalForm
                width={680}
                modalStore={modalStore}
                tableStore={tableStore}
                entityTranslationNs="country"
                formFields={<CountryEntityForm/>}
                transformNotificationParameter={createNotificationTransform.fromField('name')}
            />
        </>)
        ;
}
export default (Country);

