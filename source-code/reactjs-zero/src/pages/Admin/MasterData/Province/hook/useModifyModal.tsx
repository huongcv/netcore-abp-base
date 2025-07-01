import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {useModifyEntityModal} from "@ord-components/modal/GlobalModalManager/hook/useModifyEntityModal";
import {ProvinceService} from "@api/base/ProvinceService";
import {ProvinceEntityForm} from "@pages/Admin/MasterData/Province/EntityForm";

export const useProvinceModifyModal = (onSaved?: () => void) => {
    return useModifyEntityModal({
        apiService: ProvinceService,
        entityTranslationNs: 'province',
        transformNotificationParameter: createNotificationTransform.fromField('name'),
        modalProps: {
            width: 500,
        },
        formFields: <ProvinceEntityForm/>,
        onSaved: onSaved
    });
};
