import { PARTNER_TYPE } from "@api/index.defs";
import { PartnerGroupService } from "@api/PartnerGroupService";
import { PartnerService } from "@api/PartnerService";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";

export function usePartnerUtils() {
    const { selectDataSourceStore } = useStore();

    const clearDatasource = (partnerType: PARTNER_TYPE | undefined) => {
        const key = 'Partner' + partnerType
        selectDataSourceStore.clearByName(key);
        selectDataSourceStore.getOptions(key, async () =>  {
            console.log('test');
            if (partnerType) {
                const result = await PartnerService.getComboOptions({
                    partnerType: partnerType as any
                });
                if (!result || result.length === 0) {
                    return [];
                }
                return utils.mapCommonSelectOption(result);
            } else {
                return [];
            }
        });
    };

    const clearGroupDataSource = (partnerType: PARTNER_TYPE | undefined) => {
        const key = 'PartnerGroup_' + partnerType
        selectDataSourceStore.clearByName(key);
        selectDataSourceStore.getOptions(key, async () => {
            if (partnerType) {
                const result = await PartnerGroupService.getComboOptions({
                    type: partnerType
                });
                if (!result || result.length === 0) {
                    return [];
                }
                return utils.mapCommonSelectOption(result);
            } else {
                return [];
            }
        });
    };

    return { clearDatasource, clearGroupDataSource };
}