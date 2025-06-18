import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {SupplierProductReportDto} from "@api/index.defs";
import {makeObservable, observable} from "mobx";
import {SupplierReportService} from "@api/SupplierReportService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";

class SupplierImportReportStore extends CommonListStore<SupplierProductReportDto>{
    summaryData: SupplierProductReportDto;
    getNamespaceLocale(): string {
        return "report_supplier-import"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: SupplierReportService.getPagingSupplierRevenueReport,
            exportPagedResult: SupplierReportService.exportSupplierRevenueReport
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
            "productName","productCode", "lotNumber",
            "expiryDate", "unitName", "moveCode",
            "totalAmount", "returnTotalAmount", "moveQty",
            "returnQty", "price", "totalMove",
        ]
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default SupplierImportReportStore;
