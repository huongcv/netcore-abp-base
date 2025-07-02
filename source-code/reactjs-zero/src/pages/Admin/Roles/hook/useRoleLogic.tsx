import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/hooks/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {UserDetailDto} from "@api/base/index.defs";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {RoleService} from "@api/base/RoleService";
import {CheckCircleOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import {useListUserAssignableModal} from "@pages/Admin/Roles/hook/useListUserAssignableModal";
import {useListUsersInRoleModal} from "@pages/Admin/Roles/hook/useListUsersInRoleModal";
// Stores
const tableStore = createTableStore(RoleService);
const modalStore = createModalFormStore(RoleService, {});


export const useRoleLogic = () => {
    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete, mode} = modalStore();
    const policies = PermissionUtil.crudPermission(PERMISSION_NAME_APP.admin.role);
    const isCreateNew = mode === 'create';
    const {openListUserAssignableModal} = useListUserAssignableModal();
    const {openListUsersInRoleModal} = useListUsersInRoleModal();
    // Top actions
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: policies.base,
            onClick: () => {
                onExportExcel().then();
            }
        },
        {
            title: 'addNew',
            permission: policies.create,
            onClick: openCreate
        }
    ];
    const tableActions: ITableAction<UserDetailDto>[] = [{
        title: 'view',
        onClick: async (d) => {
            const res = await RoleService.getById({
                body: {
                    encodedId: d.encodedId
                }
            });
            openView(res.data || {});
        }
    },
        {
            title: 'edit',
            permission: policies.edit,
            onClick: async (d) => {
                const res = await RoleService.getById({
                    body: {
                        encodedId: d.encodedId
                    }
                });
                openEdit(res.data || {});
            }
        },
        {
            title: 'ListUserAssign',
            icon: <UserOutlined/>,
            permission: policies.edit,
            onClick: (d) => {
                openListUsersInRoleModal(d, () => {
                    tableStore.getInitialState().onLoadData();
                })
            },
        }, {
            title: 'AssignableUsersToRole',
            icon: <CheckCircleOutlined/>,
            permission: policies.edit,
            onClick: (d) => {
                openListUserAssignableModal(d, () => {
                    tableStore.getInitialState().onLoadData();
                });
            },
        }, {
            title: 'remove',
            onClick: (d) => {
                openDelete(d);
            },
            permission: policies.remove
        }
    ];

    return {
        tableStore,
        modalStore,
        topActions,
        tableActions,
        crudActions: {
            openView,
            openCreate,
            openEdit,
            openDelete,
            onExportExcel
        },
        isCreateNew
    };
};