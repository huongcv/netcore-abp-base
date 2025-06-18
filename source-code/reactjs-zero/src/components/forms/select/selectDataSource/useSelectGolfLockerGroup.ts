import { useTranslation } from "react-i18next";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { GolfLockerGroupService } from "@api/GolfLockerGroupService";
import { useEffect } from "react";
import { useStore } from "@ord-store/index";

export const useSelectGolfLockerGroup = (isPublic? : boolean): SelectDataSource => {
    const { t } = useTranslation('common');
    const key = 'GolfLockerGroup';
    const {selectDataSourceStore} = useStore();
    useEffect(()=>{
        selectDataSourceStore.clearByName(key)
    },[isPublic])

    return useSelectDataSource(key, async () => {
        const result = await GolfLockerGroupService.getComboOptions({isPublic});
        return Utils.mapCommonSelectOption(result);
    });
};
