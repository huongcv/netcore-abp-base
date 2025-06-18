import {DailySummaryProductReportOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";
import {DailySummaryProductReportService} from "@api/DailySummaryProductReportService";

class ReportDailySummaryProductStore extends CommonListStore<DailySummaryProductReportOutputDto, DailySummaryProductReportOutputDto> {
    summaryData: DailySummaryProductReportOutputDto = {};

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    getNamespaceLocale(): string {
        return "report_daily_summary_product"
    }

    apiService() {
        return {
            getPaged: DailySummaryProductReportService.getPaged,
            exportPagedResult: DailySummaryProductReportService.exportExcel
        } as CommonCrudApi<DailySummaryProductReportOutputDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};

        DailySummaryProductReportService.getPagedSummary({
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
            'order', 'totalAmountBeforeDiscount2',
            "productCode", "productName", "basicUnitName", "qtyConvert", "totalAmount",
            "taxAmount", "discountAmount", 'discountAmountAllocation', "returnQtyConvert", "returnTotalAmount", "revenueAmount"]
    }

    getInitModal(): ICreateOrUpdateModal<DailySummaryProductReportOutputDto> {
        return {
            width: '70%'
        };
    }
}

export default ReportDailySummaryProductStore;
