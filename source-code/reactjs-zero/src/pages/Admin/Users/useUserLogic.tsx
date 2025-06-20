// pages/Admin/MasterData/Country/useCountryLogic.ts
import {createTableStore} from "@ord-components/paged-table";
import {createModalFormStore} from "@ord-components/paged-table/useModalFormStoreFactory";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {UserService} from "@api/base/UserService";

export const useUserLogic = () => {
    // Stores
    const tableStore = createTableStore(UserService);
    const modalStore = createModalFormStore(UserService, {});
    const {onExportExcel} = tableStore();
    const {openView, openCreate, openEdit, openDelete} = modalStore();
    // policies name
    const policies = {
        base: 'AuthPlugin.User',
        addNew: 'AuthPlugin.User.Create',
        edit: 'AuthPlugin.User.Update',
        remove: 'AuthPlugin.User.Remove',
        resetPassword: 'AuthPlugin.User.ResetPassword',
        assignRole: 'AuthPlugin.User.AssignRole',
        loginWithAccount: 'AuthPlugin.User.LoginPasswordless'
    };
    // Columns configuration


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
            permission: policies.addNew,
            onClick: openCreate
        }
    ];

    return {
        tableStore,
        modalStore,
        topActions,
        actions: {
            openView,
            openCreate,
            openEdit,
            openDelete
        }
    };
};