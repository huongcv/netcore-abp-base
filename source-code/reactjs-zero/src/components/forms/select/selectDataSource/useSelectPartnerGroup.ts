import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {PARTNER_TYPE} from "@api/index.defs";
import {PartnerGroupService} from "@api/PartnerGroupService";

export const useSelectPartnerGroup = (patientType: PARTNER_TYPE): SelectDataSource => {
    const key = 'PartnerGroup_' + patientType;

    return useSelectDataSource(key, async () => {
        if (!patientType) {
            return [];
        }
        const result = await PartnerGroupService.getComboOptions({
            type: patientType
        });
        return Utils.mapCommonSelectOption(result);
    });
};
