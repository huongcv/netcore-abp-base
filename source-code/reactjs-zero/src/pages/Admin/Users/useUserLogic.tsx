// pages/Admin/MasterData/Country/useCountryLogic.ts
import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {UserService} from "@api/base/UserService";
import {USER_POLICIES} from "@pages/Admin/Users/user.constants";
// Stores
const tableStore = createTableStore(UserService);
const modalStore = createModalFormStore(UserService, {});


export const useUserLogic = () => {


    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    // Columns configuration


    // Top actions
    const topActions: IActionBtn[] = [
        {
            title: 'exportExcel',
            permission: USER_POLICIES.BASE,
            onClick: () => {
                onExportExcel().then();
            }
        },
        {
            title: 'addNew',
            permission: USER_POLICIES.CREATE,
            onClick: openCreate
        }
    ];

    return {
        tableStore,
        modalStore,
        topActions,
        crudActions: {
            openView,
            openCreate,
            openEdit,
            openDelete,
            onExportExcel
        }
    };
};