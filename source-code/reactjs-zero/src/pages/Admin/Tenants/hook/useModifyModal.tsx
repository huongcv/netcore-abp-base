import {TenantPagedDto} from "@api/base/index.defs";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {useModifyEntityModal} from "@ord-components/modal/GlobalModalManager/hook/useModifyEntityModal";
import {TenantService} from "@api/base/TenantService";
import {TenantEntityForm} from "@pages/Admin/Tenants/EntityForm";

export const useTenantModifyModal = (onSaved?: () => void) => {
    return useModifyEntityModal<TenantPagedDto>({
        apiService: TenantService,
        entityTranslationNs: 'tenant',
        transformNotificationParameter: createNotificationTransform.fromField('name'),
        modalProps: {
            width: 800,
        },
        formFields: <TenantEntityForm/>,
        onSaved: onSaved
    });
};
