import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerRevenueReportDto, SupplierProductReportDto} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SupplierReportService} from "@api/SupplierReportService";
import {EmployeeReportService} from "@api/EmployeeReportService";
import {makeObservable, observable} from "mobx";

class SupplierProductReportStore extends CommonListStore<SupplierProductReportDto>{
    summaryData: SupplierProductReportDto;
    getNamespaceLocale(): string {
        return "report_supplier-product"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: SupplierReportService.getPagingSupplierProductReport,
            exportPagedResult: SupplierReportService.exportSupplierProductReport
        } as CommonCrudApi<SupplierProductReportDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        SupplierReportService.getSummarySupplierRevenueReport({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }
    protected getOtherFields(): string[] {
        return [
            'total', 'fromDate', 'toDate',
            'order', "supplierName","supplierCode",
            "productName","productCode", "productCount",
            "totalAmount", "returnTotalAmount", "moveQty",
            "returnQty", "price", "totalMove",
        ]
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default SupplierProductReportStore;
