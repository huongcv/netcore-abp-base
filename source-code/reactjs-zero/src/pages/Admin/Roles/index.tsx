import React from "react";
import {RoleDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {useRoleLogic} from "@pages/Admin/Roles/useRoleLogic";
import {PageLayoutWithTable} from "@ord-components/paged-table/components/PageLayoutWithTable";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {PagedTable} from "@ord-components/paged-table";
import {ModifyModalForm} from "@ord-components/paged-table/components/ModifyModalForm";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {RoleService} from "@api/base/RoleService";
import RoleEntityForm from "@pages/Admin/Roles/EntityForm";
import {RoleSearchForm} from "@pages/Admin/Roles/SearchForm";
import {roleUserListModalStore, UserListModal} from "@pages/Admin/Roles/ListUsers/Modal";
import {UserListAssignableRoleModal} from "@pages/Admin/Roles/ListUserAssignable/Modal";
import {UserOutlined} from "@ant-design/icons";
import {l} from "@ord-core/language/lang.utils";

const Roles: React.FC = () => {
    const {
        topActions,
        modalStore,
        tableStore,
        crudActions,
        tableActions
    } = useRoleLogic();
    const columns = TableUtil.getColumns<RoleDto>([
        {
            title: 'code',
            dataIndex: 'code',
            width: 100,
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: 200,
        }, {
            title: 'user_assigned_role_count',
            dataIndex: 'userAssignedCount',
            width: 150,
            align: 'right',
            render: (value, dto) => <>
                <a onClick={() => {
                    roleUserListModalStore.getInitialState().openModal(dto);
                }} title={l.transCommon("view_list_detail")}>
                    <span className={'me-2'}>{value}</span>
                    <UserOutlined/>
                </a>
            </>
        }, {
            title: 'description',
            dataIndex: 'description'
        },
        IsActivedColumn()
    ], {
        actions: tableActions
    })
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<RoleSearchForm/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={RoleService.getCountByActive}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
            <ModifyModalForm
                width={800}
                modalStore={modalStore}
                tableStore={tableStore}
                entityTranslationNs="role"
                formFields={<RoleEntityForm/>}
                transformNotificationParameter={createNotificationTransform.fromMapping({
                    name: 'name'
                })}
            />
            <UserListModal/>
            <UserListAssignableRoleModal/>
        </>)
        ;
}
export default Roles;

