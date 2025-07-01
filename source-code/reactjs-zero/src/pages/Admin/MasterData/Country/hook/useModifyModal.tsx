import {CountryPagedDto} from "@api/base/index.defs";
import {CountryService} from "@api/base/CountryService";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {CountryEntityForm} from "@pages/Admin/MasterData/Country/EntityForm";
import {useModifyEntityModal} from "@ord-components/modal/GlobalModalManager/hook/useModifyEntityModal";

export const useCountryModifyModal = (onSaved?: () => void) => {
    return useModifyEntityModal<CountryPagedDto>({
        apiService: CountryService,
        entityTranslationNs: 'country',
        transformNotificationParameter: createNotificationTransform.fromField('name'),
        modalProps: {
            width: 500,
        },
        formFields: <CountryEntityForm/>,
        onSaved: onSaved
    });
};
