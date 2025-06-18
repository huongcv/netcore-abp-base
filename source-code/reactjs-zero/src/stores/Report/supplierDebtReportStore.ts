import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerDebtReportDto, CustomerRevenueReportDto, SupplierDebtReportDto} from "@api/index.defs";
import {CustomerReportService} from "@api/CustomerReportService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";
import {SupplierReportService} from "@api/SupplierReportService";

class SupplierDebtReportStore extends CommonListStore<SupplierDebtReportDto> {
    summaryData: SupplierDebtReportDto;

    getNamespaceLocale(): string {
        return "report_SupplierDebt"
    }

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: SupplierReportService.getPagingSupplierDebtReport,
            exportPagedResult: SupplierReportService.exportSupplierDebtReport
        } as CommonCrudApi<SupplierDebtReportDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        SupplierReportService.getSummarySupplierDebtReport({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'order',
            "customerName",
            "customerCode",
            "totalPurchase", "beginingDebtPeriod", "endingDebtPeriod", "totalPayment", "duringDebtPeriod"]
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default SupplierDebtReportStore;
