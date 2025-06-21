import React from "react";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
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
import {CountryDto} from "@api/index.defs";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";


const tableStore = createTableStore(CountryService);
const modalStore = createModalFormStore(CountryService, {});

const Country: React.FC = () => {
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    const {onExportExcel} = tableStore();
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
                formFields={<EntityForm/>}
                transformNotificationParameter={createNotificationTransform.fromField('name')}
            />
        </>)
        ;
}
export default (Country);

