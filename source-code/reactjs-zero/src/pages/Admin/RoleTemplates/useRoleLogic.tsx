import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/hooks/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {UserDetailDto} from "@api/base/index.defs";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {RoleService} from "@api/base/RoleService";
import {RoleTemplateService} from "@api/base/RoleTemplateService";
// Stores
const tableStore = createTableStore(RoleTemplateService);
const modalStore = createModalFormStore(RoleTemplateService, {});


export const useRoleTemplateLogic = () => {
    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete, mode} = modalStore();
    const policies = PermissionUtil.crudPermission(PERMISSION_NAME_APP.admin.role);
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
        counterFetcher: RoleTemplateService.getCountByActive,
        isCreateNew
    };
};