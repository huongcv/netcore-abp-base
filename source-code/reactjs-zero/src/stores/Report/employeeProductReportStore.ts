import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerRevenueReportDto, EmployeeProductReportDto} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {EmployeeReportService} from "@api/EmployeeReportService";
import {CustomerReportService} from "@api/CustomerReportService";
import {makeObservable, observable} from "mobx";

class EmployeeProductReportStore extends CommonListStore<EmployeeProductReportDto>{
    summaryData: EmployeeProductReportDto;
    getNamespaceLocale(): string {
        return "report_employee-product"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: EmployeeReportService.getPagedEmployeeProduct,
            exportPagedResult: EmployeeReportService.exportCustomerReportProduct
        } as CommonCrudApi<EmployeeProductReportDto>;
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
            "employeeName",
            "purchaseProduct", "payAgainProduct",
            "totalPurchase", "productName", "totalPayAgain", "totalPayment", "totalRevenue"]
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        EmployeeReportService.getSumaryEmployeeProduct({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default EmployeeProductReportStore;
