import {createTableStore} from "@ord-components/paged-table";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {UserDetailDto} from "@api/base/index.defs";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {RoleService} from "@api/base/RoleService";
import {RoleTemplateService} from "@api/base/RoleTemplateService";
import {useRoleTemplateModifyModal} from "@pages/Admin/RoleTemplates/hook/useModifyModal";
// Stores
const tableStore = createTableStore(RoleTemplateService);
export const useRoleTemplateLogic = () => {
    const {onExportExcel, onLoadData, setReloadStatusCounter} = tableStore();
    const policies = PermissionUtil.crudPermission(PERMISSION_NAME_APP.admin.role);
    // Modal actions
    const {openCreateModal, openEditModal, openDeleteConfirm, openViewModal} = useRoleTemplateModifyModal(() => {
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
    const tableActions: ITableAction<UserDetailDto>[] = [{
        title: 'view',
        onClick: async (d) => {
            const res = await RoleService.getById({
                body: {
                    encodedId: d.encodedId
                }
            });
            openViewModal(res.data);
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
                openEditModal(res.data);
            }
        }, {
            title: 'remove',
            onClick: (d) => {
                openDeleteConfirm(d);
            },
            permission: policies.remove
        }
    ];

    return {
        tableStore,
        topActions,
        tableActions,
        counterService: RoleTemplateService.getCountByActive
    };
};