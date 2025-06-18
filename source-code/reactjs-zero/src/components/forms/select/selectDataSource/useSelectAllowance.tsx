import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {Space} from "antd";
import {AllowanceDto} from "@api/index.defs";
import {AllowanceService} from "@api/AllowanceService";

export const useSelectAllowance = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'Allowance';

    return useSelectDataSource(key, async () => {
        const result = await AllowanceService.getComboOptions();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map(it => {
            return {
                ...AllowanceRenderSelectItem(it.data)
            }
        });
    });
};

export const AllowanceRenderSelectItem = (dto: AllowanceDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            <span>{dto.name}</span>
        </Space.Compact>),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([dto.name]),
    }
}
