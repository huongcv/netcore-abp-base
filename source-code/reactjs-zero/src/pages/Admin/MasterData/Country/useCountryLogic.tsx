import React, {useMemo} from "react";
import {CountryService} from "@api/base/CountryService";
import {useTableStore} from "@ord-components/paged-table/hooks/useTableStore";
import {useCrudModalStore} from "@ord-components/paged-table/hooks/useModalFormStoreFactory";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import ExcelDropdown from "@ord-components/excel/ExcelDropdown";
import {usePermissionStrings, useResourcePermission} from "@ord-core/hooks/auth/useResourcePermission";

export const COUNTRY_CONFIG = {
    // Page config
    entityName: 'country',
    permission: {
        base: 'MasterData.Country',
        // Bỏ các permission cụ thể vì sẽ sử dụng pattern Resource.Action
    }
} as const;
export const useCountryLogic = () => {
    // Resource permissions
    const countryPermissions = useResourcePermission(COUNTRY_CONFIG.permission.base);
    const {
        permissions,           // Object chứa all permission strings
    } = usePermissionStrings(COUNTRY_CONFIG.permission.base);
    // Stores
    const tableStore = useTableStore(CountryService);
    const modalStore = useCrudModalStore(CountryService);

    // Modal actions
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    const {onExportExcel} = tableStore();

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
                onClick: () => openCreate()
            });
        }

        return actions;
    }, [
        countryPermissions,
        onExportExcel,
        openCreate
    ]);

    // Table actions
    // Table actions với resource permission
    const tableActions = useMemo(() => [
        {
            title: 'view',
            onClick: openView,
            permission: permissions.getDetail
        },
        {
            title: 'edit',
            permission: permissions.update,
            onClick: openEdit
        },
        {
            title: 'remove',
            permission: permissions.delete,
            onClick: openDelete
        }
    ], [openView, openEdit, openDelete]);

    return {
        // Stores
        tableStore,
        modalStore,

        // Actions
        topActions,
        tableActions,

        // Utils
        entityTranslationNs: COUNTRY_CONFIG.entityName,
        transformNotification: createNotificationTransform.fromField('name'),

        // Services
        counterService: CountryService.getCountByActive
    };
};