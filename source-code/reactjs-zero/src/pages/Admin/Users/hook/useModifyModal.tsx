import {RolePagedDto} from "@api/base/index.defs";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {useModifyEntityModal} from "@ord-components/modal/GlobalModalManager/hook/useModifyEntityModal";
import UserEntityForm from "@pages/Admin/Users/EntityForm";
import {UserService} from "@api/base/UserService";

export const useUserModifyModal = (onSaved?: () => void) => {
    return useModifyEntityModal<RolePagedDto>({
        apiService: UserService,
        entityTranslationNs: 'user',
        transformNotificationParameter: createNotificationTransform.fromMapping({
            name: 'userName'
        }),
        modalProps: {
            width: 800,
        },
        formFields: <UserEntityForm/>,
        onSaved: onSaved
    });
};
