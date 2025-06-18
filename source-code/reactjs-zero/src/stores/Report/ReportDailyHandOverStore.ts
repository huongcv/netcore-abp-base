import {ShopWorkShiftDto} from "@api/index.defs";
import {makeObservable, observable} from "mobx";
import {ShopWorkShiftService} from "@api/ShopWorkShiftService";
import {endOfDay, startOfDay} from "date-fns";

class ReportDailyHandOverStore {
    dataSource: ShopWorkShiftDto[] = [];

    constructor() {
        makeObservable(this, {
            dataSource: observable
        });
    }

    getNamespaceLocale(): string {
        return "report-daily-hand-over";
    }

    loadDataSource(input: { startDate: Date }) {
        ShopWorkShiftService.getPaged({
            body: {
                dateRange: {
                    startDate: startOfDay(input.startDate),
                    endDate: endOfDay(input.startDate),
                },
                status: 2,
                skipCount: 0,
                maxResultCount: 1000
            }
        }).then(res => {
            this.dataSource = res.items ?? [];
        })
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [
          ]
    }


}

export default ReportDailyHandOverStore;
