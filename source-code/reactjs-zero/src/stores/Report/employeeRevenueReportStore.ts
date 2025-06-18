import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerRevenueReportDto, EmployeeRevenueReportDto} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {EmployeeReportService} from "@api/EmployeeReportService";
import {CustomerReportService} from "@api/CustomerReportService";
import {makeObservable, observable} from "mobx";

class EmployeeRevenueReportStore extends CommonListStore<EmployeeRevenueReportDto>{
    summaryData: CustomerRevenueReportDto;
    getNamespaceLocale(): string {
        return "report_employee-revenue"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: EmployeeReportService.getPagedEmployeeRevenue,
            exportPagedResult: EmployeeReportService.exportEmployeeReportRevenue
        } as CommonCrudApi<EmployeeRevenueReportDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        EmployeeReportService.getSumaryEmployeeRevenue({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }
    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'order',
            "invoiceDate", "employeeName",
            "totalPurchase", "totalDiscount", "totalVAT", "totalPayment",
            "totalDebt", "totalPayAgain", "totalRevenue"
        ]
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default EmployeeRevenueReportStore;
