import {DailySummaryShiftRevenueOutputDto} from "@api/index.defs";
import {CommonListStore} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";
import {DailySummaryShiftRevenueService} from "@api/DailySummaryShiftRevenueService";

class ReportDailySummaryShiftRevenueStore extends CommonListStore<DailySummaryShiftRevenueOutputDto> {
    summaryData: DailySummaryShiftRevenueOutputDto;

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    getNamespaceLocale(): string {
        return "report-daily-shift-revenue"
    }

    apiService() {
        return {
            getPaged: DailySummaryShiftRevenueService.getPaged,
            exportPagedResult: DailySummaryShiftRevenueService.exportExcel
        } as CommonCrudApi<DailySummaryShiftRevenueOutputDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};

        DailySummaryShiftRevenueService.getPagedSummary({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [
            'total',
            'reportDate',
            "employeeName",
            "order",
            "name",
            'startDate',"endDate",
            "openingCash", "receiptAmount", "otherReceiptAmount", "otherPaymentAmount",
            "closingCash"]
    }

    getInitModal() {
        return {
            width: '70%'
        };
    }
}

export default ReportDailySummaryShiftRevenueStore;
