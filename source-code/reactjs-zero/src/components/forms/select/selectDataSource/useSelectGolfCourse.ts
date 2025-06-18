import { useTranslation } from "react-i18next";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { ProductGroupService } from "@api/ProductGroupService";
import { GolfAreaService } from "@api/GolfAreaService";
import { GolfCourseService } from "@api/GolfCourseService";

export const useSelectGolfCourse = (): SelectDataSource => {
    const { t } = useTranslation('common');
    const key = 'GolfCourse';

    return useSelectDataSource(key, async () => {
        const result = await GolfCourseService.getComboOptions({});
        return Utils.mapCommonSelectOption(result);
    });
};
