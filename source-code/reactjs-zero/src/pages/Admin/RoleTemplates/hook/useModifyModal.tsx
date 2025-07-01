import {RolePagedDto} from "@api/base/index.defs";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {useModifyEntityModal} from "@ord-components/modal/GlobalModalManager/hook/useModifyEntityModal";
import {RoleTemplateEntityForm} from "@pages/Admin/RoleTemplates/EntityForm";
import {RoleTemplateService} from "@api/base/RoleTemplateService";

export const useRoleTemplateModifyModal = (onSaved?: () => void) => {
    return useModifyEntityModal<RolePagedDto>({
        apiService: RoleTemplateService,
        entityTranslationNs: 'role',
        transformNotificationParameter: createNotificationTransform.fromField('name'),
        modalProps: {
            width: 800,
        },
        formFields: <RoleTemplateEntityForm/>,
        onSaved: onSaved
    });
};
