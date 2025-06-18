import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerRevenueReportDto} from "@api/index.defs";
import {CustomerReportService} from "@api/CustomerReportService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";

class CustomerRevenueReportDetailStore extends CommonListStore<CustomerRevenueReportDto>{
    summaryData: CustomerRevenueReportDto;
    getNamespaceLocale(): string {
        return "report_customer-revenue-detail"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }
    apiService() {
        return {
            getPaged: CustomerReportService.getPagingCustomerRevenueReportDetail,
            exportPagedResult: CustomerReportService.exportCustomerRevenueReportDetail
        } as CommonCrudApi<CustomerRevenueReportDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }
    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        CustomerReportService.getSummaryCustomerRevenue({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }
    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'order', 'invoiceCode',
            "invoiceDate", "customerName",
            "customerCode",
            "totalPurchase", "totalPayAgain", "totalRevenue"]
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default CustomerRevenueReportDetailStore;
