import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerRevenueReportDto, EmployeeRevenueReportDetailDto} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {EmployeeReportService} from "@api/EmployeeReportService";
import {CustomerReportService} from "@api/CustomerReportService";
import {makeObservable, observable} from "mobx";

class EmployeeRevenueReportDetailStore extends CommonListStore<EmployeeRevenueReportDetailDto>{
    summaryData: CustomerRevenueReportDto;
    getNamespaceLocale(): string {
        return "report_employee-revenue-detail"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: EmployeeReportService.getPagedEmployeeRevenueDetail,
            exportPagedResult: EmployeeReportService.exportEmployeeReportRevenueDetail
        } as CommonCrudApi<EmployeeRevenueReportDetailDto>;
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
            'order', 'invoiceCode',
            "invoiceDate", "employeeName",
            "totalPurchase", "totalPayAgain", "totalRevenue"]
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        EmployeeReportService.getSumaryEmployeeRevenue({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default EmployeeRevenueReportDetailStore;
