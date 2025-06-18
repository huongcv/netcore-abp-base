import {DailySummaryIncomeReportOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";
import {DailySummaryIncomeReportService} from "@api/DailySummaryIncomeReportService";

class ReportDailySummaryIncomeStore extends CommonListStore<DailySummaryIncomeReportOutputDto, DailySummaryIncomeReportOutputDto> {
    summaryData: DailySummaryIncomeReportOutputDto;

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    getNamespaceLocale(): string {
        return "report_dailySummaryIncome"
    }

    apiService() {
        return {
            getPaged: DailySummaryIncomeReportService.getPaged,
            exportPagedResult: DailySummaryIncomeReportService.exportExcel
        } as CommonCrudApi<DailySummaryIncomeReportOutputDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        DailySummaryIncomeReportService.getPagedSummary({
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
            'order', 'accountMoveCode', 'accountMoveDate', 'partnerInfo', 'strPaymentMethod', 'amount', 'income', 'notes']
    }

    getInitModal(): ICreateOrUpdateModal<DailySummaryIncomeReportOutputDto> {
        return {
            width: '70%'
        };
    }
}

export default ReportDailySummaryIncomeStore;
