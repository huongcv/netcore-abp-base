import {createTableStore} from "@ord-components/paged-table";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {SettingPagedDto, TenantPagedDto} from "@api/base/index.defs";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import React from "react";
import {useModifyEntityModal} from "@ord-components/modal/GlobalModalManager/hook/useModifyEntityModal";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import {CommonSettingForm} from "@pages/Admin/Setting/components/CommonSettingForm";
// Stores
const tableStore = createTableStore(HostSystemSettingService);
export const useCommonSettingModifyModal = (onSaved?: () => void) => {
    return useModifyEntityModal<TenantPagedDto>({
        apiService: HostSystemSettingService,
        entityTranslationNs: 'common-setting',
        transformNotificationParameter: createNotificationTransform.fromField('name'),
        modalProps: {
            width: 600,
        },
        formFields: <CommonSettingForm/>,
        onSaved: onSaved
    });
};


export const useCommonSettingLogic = () => {
    const {onExportExcel, onLoadData, setReloadStatusCounter} = tableStore();
    const policies = PermissionUtil.crudPermission(PERMISSION_NAME_APP.admin.setting);
    // Modal actions
    const {openCreateModal, openEditModal, openDeleteConfirm, openViewModal} = useCommonSettingModifyModal(() => {
        onLoadData();
        setReloadStatusCounter();
    });
    // Top actions
    const topActions: IActionBtn[] = [
        {
            title: 'addNew',
            permission: policies.create,
            onClick: openCreateModal
        }
    ];

    const tableActions: ITableAction<SettingPagedDto>[] = [
        {
            title: 'edit',
            permission: policies.edit,
            onClick: async (d) => {
                const getByDetail = await HostSystemSettingService.getById({
                    body: {
                        encodedId: d.encodedId
                    }
                });
                openEditModal(getByDetail?.data);
            }
        }];

    return {
        tableStore,
        topActions,
        tableActions
    };
};