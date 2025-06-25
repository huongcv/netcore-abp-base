import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/hooks/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {UserDetailDto} from "@api/base/index.defs";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {RoleService} from "@api/base/RoleService";
import {UserOutlined} from "@ant-design/icons";
import ListUserAssign from "@pages/Admin/Roles/ListUserAssign";
import React from "react";
import {roleUserListModalStore} from "@pages/Admin/Roles/ListUsers/Modal";
// Stores
const tableStore = createTableStore(RoleService);
const modalStore = createModalFormStore(RoleService, {});


export const useRoleLogic = () => {
    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete, mode} = modalStore();
    const policies = PermissionUtil.crudPermission(PERMISSION_APP.admin.role);
    const isCreateNew = mode === 'create';
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
            openView(res.data);
        }
    },
        {
            title: 'ListUserAssign',
            icon: <UserOutlined/>,
            permission: policies.edit,
            onClick: (d) => {
                roleUserListModalStore.getInitialState().openModal(d);
                // entityModalStore.openModalView({
                //     modal: {
                //         title: t('ListUserAssignTitleModal', {...d}),
                //         width: '90vw',
                //         style: {
                //             maxWidth: 1100
                //         },
                //         hiddenOk: true
                //     },
                //     modalContent: <ListUserAssign roleId={d.id} roleName={d.name}/>
                // });
            },
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
                openEdit(res.data);
            }
        }];

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