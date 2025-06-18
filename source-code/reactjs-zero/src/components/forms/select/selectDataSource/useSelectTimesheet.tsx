import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {Space, Tag} from "antd";
import {EmployeeTimesheetService} from "@api/EmployeeTimesheetService";
import {EmployeeTimesheetDto} from "@api/index.defs";

export const useSelectTimesheet = (): SelectDataSource => {
    const {t} = useTranslation('common');
    const key = 'Timesheet';

    return useSelectDataSource(key, async () => {
        const result = await EmployeeTimesheetService.getComboOptions();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map(it => {
            return {
                ...TimesheetRenderSelectItem(it.data)
            }
        });
    });
};

export const TimesheetRenderSelectItem = (dto: EmployeeTimesheetDto) => {
    return {
        value: dto.id,
        label: (<Space.Compact>
            <span>{dto.name}</span>
        </Space.Compact>),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.name]),
    }
}
