import React from "react";
import {ShopInfoDto} from "@api/index.defs";
import {l} from "@ord-core/language/lang.utils";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {useTenantLogic} from "@pages/Admin/Tenants/useTenantLogic";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {ModifyModalForm} from "@ord-components/paged-table/components/ModifyModalForm";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {TenantService} from "@api/base/TenantService";
import {TenantEntityForm} from "@pages/Admin/Tenants/EntityForm";
import {TenantSearchForm} from "@pages/Admin/Tenants/SearchForm";

const Tenants: React.FC = () => {
    const {
        topActions,
        modalStore,
        tableStore,
        crudActions,
        tableActions
    } = useTenantLogic();
    const {mode} = modalStore();
    const columns = TableUtil.getColumns<ShopInfoDto>([
        {
            title: 'tenant_code',
            dataIndex: 'tenantCode',
            width: 100,
        },
        {
            title: 'tenant_name',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: l.transCommon('PhoneNumber'),
            dataIndex: 'phoneNumber',
            width: 160

        }, {
            title: l.transCommon('Email'),
            dataIndex: 'email',
            width: 100
        },
        {
            title: l.transCommon('Address'),
            dataIndex: 'address',
            width: 200
        },
        IsActivedColumn()
    ], {
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

