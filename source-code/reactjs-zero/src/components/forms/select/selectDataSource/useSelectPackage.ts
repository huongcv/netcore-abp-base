import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useTranslation} from "react-i18next";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import Utils from "@ord-core/utils/utils";
import {PackageService} from "@api/PackageService";
import {DistrictService} from "@api/DistrictService";
import {ShopPackageRegistrationType} from "@api/index.defs";

export const useSelectPackage = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'package';

    return useSelectDataSource(key, async () => {
        const result = await PackageService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};


export const useSelectPackageTrial = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'packageTrial';

    return useSelectDataSource(key, async () => {
        const result = await PackageService.getComboTrialOptions();
        return Utils.mapCommonSelectOption(result);
    });
};

