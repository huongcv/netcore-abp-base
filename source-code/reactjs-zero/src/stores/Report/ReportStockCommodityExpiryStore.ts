import {
    StockReportCommodityExpiryOutputDto,
    StockReportCommodityExpiryPagingInputDto,
    SummaryStockReportCommodityExpiryOutputDto
} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";
import {l} from "@ord-core/language/lang.utils";
import FileSaver from "file-saver";
import { StockExpiryReportService } from "@api/StockExpiryReportService";

class ReportStockCommodityExpiryStore extends CommonListStore<StockReportCommodityExpiryOutputDto> {
    summaryData: SummaryStockReportCommodityExpiryOutputDto[];
    status: -1 | 1 | 2 | 3 = -1;

    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return 'report_stockCommodityExpiry';
    }

    apiService() {
        return {
            getPaged: StockExpiryReportService.getPaging,
            exportPagedResult: StockExpiryReportService.exportReport
        } as CommonCrudApi<StockReportCommodityExpiryOutputDto>;
    }

    setSummary(params: any) {
        StockExpiryReportService.summaryStockExpiry({
            body: params ?? this.searchDataState
        }).then(res => {
            this.summaryData = res;
        });
    }

    setStatus(val: -1 | 1 | 2 | 3) {
        this.status = val;
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [
            'expiryDay',
            'order',
            "inventoryId",
            "productCode",
            "productName", "basicUnitName", "lotNumber",
            "expiryDate", "daysRemaining", "qty", "stock", "outOfDate"
        ]
    }

    getInitModal(): ICreateOrUpdateModal<StockReportCommodityExpiryOutputDto> {
        return {
            width: '70%'
        };
    }

    async exportReportForDashboard(titlePage: string, fileName: string, status: number) {
        UiUtils.setBusy();
        try {
            const otherFieldArr = this.getOtherFields();
            const otherFieldObj: any = {}
            if (otherFieldArr) {
                otherFieldArr.forEach(it => {
                    otherFieldObj[it] = l.trans(this.getNamespaceLocale() + "." + it, null);
                });
            }
            const body = {
                status: status,
                expiryDay: new Date(),
                export: {
                    title: titlePage,
                    otherFields: otherFieldObj
                }
            } as StockReportCommodityExpiryPagingInputDto;
            const resultBlob = await this.exportPaged(body);
            FileSaver.saveAs(resultBlob, fileName);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
}

export default ReportStockCommodityExpiryStore;
