import {RolePagedDto} from "@api/base/index.defs";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {useModifyEntityModal} from "@ord-components/modal/GlobalModalManager/hook/useModifyEntityModal";
import {RoleService} from "@api/base/RoleService";
import RoleEntityForm from "@pages/Admin/Roles/EntityForm";

export const useRoleModifyModal = (onSaved?: () => void) => {
    return useModifyEntityModal<RolePagedDto>({
        apiService: RoleService,
        entityTranslationNs: 'role',
        transformNotificationParameter: createNotificationTransform.fromField('name'),
        modalProps: {
            width: 800,
        },
        formFields: <RoleEntityForm/>,
        onSaved: onSaved
    });
};
