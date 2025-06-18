import {CustomerReportService} from "@api/CustomerReportService";
import {CustomerRevenueReportDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SellReportService} from "@api/SellReportService";
import {makeObservable, observable} from "mobx";

class CustomerRevenueReportStore extends CommonListStore<CustomerRevenueReportDto>{
    summaryData: CustomerRevenueReportDto;
    getNamespaceLocale(): string {
        return "report_customer-revenue"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: CustomerReportService.getPagingCustomerRevenueReport,
            exportPagedResult: CustomerReportService.exportCustomerRevenueReport
        } as CommonCrudApi<CustomerRevenueReportDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        CustomerReportService.getSummaryCustomerRevenue({
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
            "invoiceDate", "customerName",
            "customerCode",
            "totalPurchase", "totalDiscount", "totalVAT", "totalPayment", "totalDebt", "totalPayAgain", "totalRevenue"]
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default CustomerRevenueReportStore;
