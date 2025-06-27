import {useMemo} from "react";
import {CountryService} from "@api/base/CountryService";
import {useTableStore} from "@ord-components/paged-table/hooks/useTableStore";
import {useCrudModalStore} from "@ord-components/paged-table/hooks/useModalFormStoreFactory";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import ExcelDropdown from "@ord-components/excel/ExcelDropdown";

export const COUNTRY_CONFIG = {
    // Page config
    entityName: 'country',
    permission: {
        base: 'MasterData.Country',
        getPaged: 'MasterData.GetPaged',
        createOrUpdate: 'MasterData.Country.CreateOrUpdate',
        remove: 'MasterData.Country.Remove',
    }
} as const;
export const useCountryLogic = () => {
    // Stores
    const tableStore = useTableStore(CountryService);
    const modalStore = useCrudModalStore(CountryService);

    // Modal actions
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    const {onExportExcel} = tableStore();

    // Top actions
    const topActions: IActionBtn[] = useMemo(() => [
        {
            permission: COUNTRY_CONFIG.permission.getPaged,
            content: <>
                <ExcelDropdown onExport={onExportExcel} importRoute={'import'}/>
            </>
        },
        {
            title: 'addNew',
            permission: COUNTRY_CONFIG.permission.createOrUpdate,
            onClick: () => openCreate()
        }
    ], [onExportExcel, openCreate]);

    // Table actions
    const tableActions = useMemo(() => [
        {
            title: 'view',
            onClick: openView
        },
        {
            title: 'edit',
            permission: COUNTRY_CONFIG.permission.createOrUpdate,
            onClick: openEdit
        },
        {
            title: 'remove',
            permission: COUNTRY_CONFIG.permission.remove,
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