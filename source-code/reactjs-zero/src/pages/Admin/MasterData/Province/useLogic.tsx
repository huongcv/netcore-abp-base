import React, {useMemo} from "react";
import {useTableStore} from "@ord-components/paged-table/hooks/useTableStore";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import ExcelDropdown from "@ord-components/excel/ExcelDropdown";
import {usePermissionStrings, useResourcePermission} from "@ord-core/hooks/auth/useResourcePermission";
import {useCountryModifyModal} from "@pages/Admin/MasterData/Country/useCountryModifyModal";
import {ProvinceService} from "@api/base/ProvinceService";
import {useProvinceModifyModal} from "@pages/Admin/MasterData/Province/useEntityModifyModal";

export const PROVINCE_CONFIG = {
    // Page config
    entityName: 'province',
    permission: {
        base: 'MasterData.Province',
    }
} as const;
export const useProvinceLogic = () => {
    // Resource permissions
    const resourcePermissions = useResourcePermission(PROVINCE_CONFIG.permission.base);
    const {
        permissions,           // Object chứa all permission strings
    } = usePermissionStrings(PROVINCE_CONFIG.permission.base);
    // Stores
    const tableStore = useTableStore(ProvinceService);
    const {onExportExcel, onLoadData, setReloadStatusCounter} = tableStore();
    // Modal actions
    const {openCreateModal, openEditModal, openDeleteConfirm, openViewModal} = useProvinceModifyModal(() => {
        onLoadData();
        setReloadStatusCounter();
    });


    // Top actions với resource permission
    const topActions: IActionBtn[] = useMemo(() => {
        const actions: IActionBtn[] = [];

        // Excel actions - kiểm tra Import/Export permissions
        if (resourcePermissions.canImport || resourcePermissions.canExport) {
            actions.push({
                content: (
                    <ExcelDropdown
                        importRoute={resourcePermissions.canImport ? 'import' : undefined}
                        onExport={resourcePermissions.canExport ? onExportExcel : undefined}
                        disableImport={!resourcePermissions.canImport}
                        disableExport={!resourcePermissions.canExport}
                    />
                )
            });
        }

        // Add new action
        if (resourcePermissions.canCreate) {
            actions.push({
                title: 'addNew',
                onClick: () => openCreateModal()
            });
        }

        return actions;
    }, [
        resourcePermissions,
        onExportExcel,
        openCreateModal
    ]);

    // Table actions
    // Table actions với resource permission
    const tableActions = useMemo(() => [
        {
            title: 'view',
            onClick: openViewModal,
            permission: permissions.getDetail
        },
        {
            title: 'edit',
            permission: permissions.update,
            onClick: openEditModal
        },
        {
            title: 'remove',
            permission: permissions.delete,
            onClick: openDeleteConfirm
        }
    ], [openViewModal, openEditModal, openDeleteConfirm]);

    return {
        tableStore,
        topActions,
        tableActions,
        counterService: ProvinceService.getCountByActive
    };
};