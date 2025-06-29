import React from "react";
import {ShopInfoDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {useTenantLogic} from "@pages/Admin/Tenants/useTenantLogic";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {ModifyModalForm} from "@ord-components/paged-table/components/ModifyModalForm";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {TenantService} from "@api/base/TenantService";
import {TenantEntityForm} from "@pages/Admin/Tenants/EntityForm";
import {TenantSearchForm} from "@pages/Admin/Tenants/SearchForm";
import {getTenantColumns} from "@pages/Admin/Tenants/Columns";

const Tenants: React.FC = () => {
    const {
        topActions,
        modalStore,
        tableStore,
        crudActions,
        tableActions
    } = useTenantLogic();
    const {mode} = modalStore();
   // const navigate = useNavigate();
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
            <ModifyModalForm
                width={800}
                modalStore={modalStore}
                tableStore={tableStore}
                entityTranslationNs="tenant"
                formFields={<TenantEntityForm/>}
                transformNotificationParameter={createNotificationTransform.fromMapping({
                    name: 'name'
                })}
            />

        </>)
        ;
}
export default Tenants;

