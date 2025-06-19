import React from "react";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {createTableStore, PagedTable} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";
import {CountryService} from "@api/base/CountryService";
import {PageLayoutWithTable} from "@ord-components/paged-table/PageLayoutWithTable";
import {ModifyModalForm} from "@ord-components/paged-table/ModifyModalForm";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {EntityForm} from "@pages/Admin/MasterData/Country/EntityForm";


const tableStore = createTableStore(CountryService);
const modalStore = createModalFormStore(CountryService, {});

const Country: React.FC = () => {
    const {countryStore: mainStore} = useStore();
    const {openView, openCreate, openEdit} = modalStore();
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'ma_quoc_gia',
            dataIndex: 'code',
            width: 200
        },
        {
            title: 'ten_quoc_gia',
            dataIndex: 'name',
        },
        {
            dataIndex: 'phoneCode',
            title: 'phoneCode',
        },
        {
            dataIndex: 'currencyCode',
            title: 'currencyCode',
        },
        IsActivedColumn()
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
                    mainStore.openRemoveById(d);
                }
            }
        ]
    });
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: 'MasterData.Country',
            onClick: () => {
                mainStore.exportExcelPagedResult().then();
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

    const TableContent = (<>

        <PagedTable columns={columns} fetcher={CountryService.getPaged}
                    tableStore={tableStore}/>
    </>);
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<SearchFilterText span={12}/>}
                tableContent={TableContent}
                tableStore={tableStore}
                tabCounterStatus={<OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                                               fetcher={CountryService.getCountByActive}/>}
            />
            <ModifyModalForm
                width={680}
                modalStore={modalStore}
                tableStore={tableStore}
                translationNs="country"
                formFields={<EntityForm/>}
            />
        </>)
        ;
}
export default (Country);

