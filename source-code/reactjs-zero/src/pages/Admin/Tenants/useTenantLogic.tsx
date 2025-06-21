import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {UserDetailDto} from "@api/base/index.defs";
import {TenantService} from "@api/base/TenantService";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_APP} from "@ord-core/config/permissions";
// Stores
const tableStore = createTableStore(TenantService);
const modalStore = createModalFormStore(TenantService, {});


export const useTenantLogic = () => {
    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete, mode} = modalStore();
    const policies = PermissionUtil.crudPermission(PERMISSION_APP.admin.tenant);
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
        onClick: (d) => {
            openView(d);
        }
    },
        {
            title: 'edit',
            permission: policies.edit,
            onClick: (d) => {
                openEdit(d);
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