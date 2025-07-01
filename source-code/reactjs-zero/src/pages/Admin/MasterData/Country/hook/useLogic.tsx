import React, {useMemo} from "react";
import {CountryService} from "@api/base/CountryService";
import {useTableStore} from "@ord-components/paged-table/hooks/useTableStore";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import ExcelDropdown from "@ord-components/excel/ExcelDropdown";
import {usePermissionStrings, useResourcePermission} from "@ord-core/hooks/auth/useResourcePermission";
import {useCountryModifyModal} from "@pages/Admin/MasterData/Country/hook/useModifyModal";

export const COUNTRY_CONFIG = {
    // Page config
    entityName: 'country',
    permission: {
        base: 'MasterData.Country',
        // Bỏ các permission cụ thể vì sẽ sử dụng pattern Resource.Action
    }
} as const;
export const useLogic = () => {
    // Resource permissions
    const countryPermissions = useResourcePermission(COUNTRY_CONFIG.permission.base);
    const {
        permissions,           // Object chứa all permission strings
    } = usePermissionStrings(COUNTRY_CONFIG.permission.base);
    // Stores
    const tableStore = useTableStore(CountryService);
    const {onExportExcel, onLoadData, setReloadStatusCounter} = tableStore();
    // Modal actions
    const {openCreateModal, openEditModal, openDeleteConfirm, openViewModal} = useCountryModifyModal(() => {
        onLoadData();
        setReloadStatusCounter();
    });


    // Top actions với resource permission
    const topActions: IActionBtn[] = useMemo(() => {
        const actions: IActionBtn[] = [];

        // Excel actions - kiểm tra Import/Export permissions
        if (countryPermissions.canImport || countryPermissions.canExport) {
            actions.push({
                content: (
                    <ExcelDropdown
                        importRoute={countryPermissions.canImport ? 'import' : undefined}
                        onExport={countryPermissions.canExport ? onExportExcel : undefined}
                        disableImport={!countryPermissions.canImport}
                        disableExport={!countryPermissions.canExport}
                    />
                )
            });
        }

        // Add new action
        if (countryPermissions.canCreate) {
            actions.push({
                title: 'addNew',
                onClick: () => openCreateModal()
            });
        }

        return actions;
    }, [
        countryPermissions,
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
        counterService: CountryService.getCountByActive
    };
};