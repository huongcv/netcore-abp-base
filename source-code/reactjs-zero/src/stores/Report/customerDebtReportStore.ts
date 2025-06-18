import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerDebtReportDto, CustomerRevenueReportDto} from "@api/index.defs";
import {CustomerReportService} from "@api/CustomerReportService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";

class CustomerDebtReportStore extends CommonListStore<CustomerDebtReportDto>{
    summaryData: CustomerDebtReportDto;
    getNamespaceLocale(): string {
        return "report_CustomerDebt"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }
    apiService() {
        return {
            getPaged: CustomerReportService.getPagingCustomerDebtReport,
            exportPagedResult: CustomerReportService.exportCustomerDebtReport
        } as CommonCrudApi<CustomerDebtReportDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        CustomerReportService.getSummaryCustomerDebt({
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

export default CustomerDebtReportStore;
