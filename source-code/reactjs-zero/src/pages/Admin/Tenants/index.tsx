import React from "react";
import {ShopInfoDto} from "@api/index.defs";
import {l} from "@ord-core/language/lang.utils";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {useTenantLogic} from "@pages/Admin/Tenants/useTenantLogic";
import {PageLayoutWithTable} from "@ord-components/paged-table/PageLayoutWithTable";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {ModifyModalForm} from "@ord-components/paged-table/ModifyModalForm";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {TenantService} from "@api/base/TenantService";
import {TenantEntityForm} from "@pages/Admin/Tenants/EntityForm";

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
            title: 'tenantCode',
            dataIndex: 'tenantCode',
            width: 100,
        },
        {
            title: 'shopCode',
            dataIndex: 'code',
            width: 140,
        },
        {
            title: 'name',
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
        {
            title: l.transCommon('Gói cước'),
            dataIndex: 'packageRegistrationCode',
            width: 150
        },
        IsActivedColumn()
    ], {
        actions: tableActions
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<UserSearchForm/>}
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
                formFields={<TenantEntityForm isCreateNew={mode === 'create'}/>}
                transformNotificationParameter={createNotificationTransform.fromMapping({
                    name: 'name'
                })}
            />

        </>)
        ;
}
export default Tenants;

