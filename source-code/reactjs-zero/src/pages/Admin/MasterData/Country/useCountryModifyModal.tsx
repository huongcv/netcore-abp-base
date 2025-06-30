import {useModifyModal} from "@ord-components/paged-table/hooks/useModifyModal";
import {CountryPagedDto} from "@api/base/index.defs";
import {CountryService} from "@api/base/CountryService";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";
import {CountryEntityForm} from "@pages/Admin/MasterData/Country/EntityForm";

export const useCountryModifyModal = (onSaved?: () => void) => {
    return useModifyModal<CountryPagedDto>({
        apiService: CountryService,
        entityTranslationNs: 'country',
        transformNotificationParameter: createNotificationTransform.fromField('name'),
        modalProps: {
            width: 680,
        },
        formFields: <CountryEntityForm/>,
        onSaved: onSaved
    });
};
