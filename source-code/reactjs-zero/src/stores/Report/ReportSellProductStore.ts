import {SellReportProductOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SellReportService} from "@api/SellReportService";
import {makeObservable, observable} from "mobx";

class ReportSellProductStore extends CommonListStore<SellReportProductOutputDto, SellReportProductOutputDto> {
    summaryData: SellReportProductOutputDto;

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    getNamespaceLocale(): string {
        return "report_product"
    }

    apiService() {
        return {
            getPaged: SellReportService.getPagingSellProductReport,
            exportPagedResult: SellReportService.exportSellProductReport
        } as CommonCrudApi<SellReportProductOutputDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        SellReportService.getSummaryProductReport({
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
            'fromDate', 'toDate',
            'order',
            "productCode", "productName", "basicUnitName", "qtyConvert",
            "totalAmount","totalPrice","discount",
            "taxAmount", "discountAmount", "finalPrice","returnQtyConvert","returnTotalAmount",  "revenueAmount"]
    }


    getInitModal(): ICreateOrUpdateModal<SellReportProductOutputDto> {
        return {
            width: '70%'
        };
    }
}

export default ReportSellProductStore;
