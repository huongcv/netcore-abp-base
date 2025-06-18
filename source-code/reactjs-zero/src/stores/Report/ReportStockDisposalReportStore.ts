import {StockDisposalReportOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import { StockCancelReportService } from "@api/StockCancelReportService";

class ReportStockDisposalReportStore extends CommonListStore<StockDisposalReportOutputDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_stockDisposalReport"
    }

    apiService() {
        return {
            getPaged: StockCancelReportService.getPaging,
            exportPagedResult: StockCancelReportService.exportReport
        } as CommonCrudApi<StockDisposalReportOutputDto>;
    }


    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'order',
            "inventoryId",
            "productCode",
            "productName", "basicUnitName",
            "valueOfDestruction", "numberOfDestruction"
        ]
    }

    getInitModal(): ICreateOrUpdateModal<StockDisposalReportOutputDto> {
        return {
            width: '70%'
        };
    }

}

export default ReportStockDisposalReportStore;
