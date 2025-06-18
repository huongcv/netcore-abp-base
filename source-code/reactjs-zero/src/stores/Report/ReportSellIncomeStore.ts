import {
    AccountMoveDto, CashbookStatisticsOutputDto,
    SellReportProductOutputDto,
    SellReportRevenueDetailOutputDto,
    SellReportRevenueDetailtPagingInputDto,
    SellReportRevenueOutputDto
} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SellReportService} from "@api/SellReportService";
import {makeObservable, observable} from "mobx";
import {AccountMoveService} from "@api/AccountMoveService";

class ReportSellInComeStore extends CommonListStore<AccountMoveDto, AccountMoveDto> {
    summaryData: CashbookStatisticsOutputDto;

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    getNamespaceLocale(): string {
        return "report_saleIncome"
    }

    apiService() {
        return {
            getPaged: SellReportService.getPagingSellIncomeReport,
            exportPagedResult: SellReportService.exportSellIncomeReport
        } as CommonCrudApi<AccountMoveDto>;
    }

    loadSummary(cusParam?: any) {
        const prm = this.searchFormRef?.getFieldsValue() || cusParam;
        SellReportService.getSummarySellIncomeReport({
            body: prm
        }).then(res => {
            if (res.data)
                this.summaryData = res.data;
        })
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'order',
            "beginningBalance","totalIncome","totalCost","endingBalance",
            "income",
            "accountMoveCode", "accountMoveReasonName", "accountMoveDate", "partnerInfo",
            "strPaymentMethod",
            "amount", "notes"]
    }

    getInitModal(): ICreateOrUpdateModal<AccountMoveDto> {
        return {
            width: '70%'
        };
    }
}

export default ReportSellInComeStore;
