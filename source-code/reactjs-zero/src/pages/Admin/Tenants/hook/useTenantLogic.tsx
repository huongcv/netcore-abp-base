import {createTableStore} from "@ord-components/paged-table";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {TenantPagedDto} from "@api/base/index.defs";
import {TenantService} from "@api/base/TenantService";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {useNavigate} from "react-router";
import {useTenantModifyModal} from "@pages/Admin/Tenants/hook/useModifyModal";
// Stores
const tableStore = createTableStore(TenantService);
export const useTenantLogic = () => {
    const {onExportExcel, onLoadData, setReloadStatusCounter} = tableStore();
    const policies = PermissionUtil.crudPermission(PERMISSION_NAME_APP.admin.tenant);
    const navigate = useNavigate();
    // Modal actions
    const {openCreateModal, openEditModal, openDeleteConfirm, openViewModal} = useTenantModifyModal(() => {
        onLoadData();
        setReloadStatusCounter();
    });
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
            onClick: openCreateModal
        }
    ];
    const tableActions: ITableAction<TenantPagedDto>[] = [{
        title: 'view',
        onClick: (d) => {
            navigate(`detail/${d.encodedId}`);
        }
    },
        {
            title: 'edit',
            permission: policies.edit,
            onClick: (d) => {
                openEditModal(d);
            }
        }];

    return {
        tableStore,
        topActions,
        tableActions
    };
};