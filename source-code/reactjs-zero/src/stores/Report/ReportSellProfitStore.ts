import {ExtensiblePagedResultDtoOfSaleInvoiceReportDto, SellReportRevenueOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SellReportService} from "@api/SellReportService";
import {makeObservable, observable} from "mobx";

class ReportSellProfitStore extends CommonListStore<
    SellReportRevenueOutputDto | any,
    SellReportRevenueOutputDto
> {
    summaryData: any;

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    getNamespaceLocale(): string {
        return "report_saleProfit"
    }

    apiService() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        const reportTypeToUrlMapping: Record<string, any> = {
            time: SellReportService.getPagingProfitByTime,
            bill: SellReportService.getPagingSellProfitInvoiceReport,
            product: SellReportService.getPagingSellProfitProductReport,
        };
        const urlApi = reportTypeToUrlMapping[prm.reportType] || SellReportService.getPagingProfitByTime;

        const reportTypeToUrlExportMapping: Record<string, any> = {
            time: SellReportService.exportProfitByTime,
            bill: SellReportService.exportSellProfitByInvoiceReport,
            product: SellReportService.exportSellProfitProductReport,
        };
        const urlApiExport = reportTypeToUrlExportMapping[prm.reportType] || SellReportService.exportProfitByTime;

        return {
            getPaged: urlApi,
            exportPagedResult: urlApiExport
        } as CommonCrudApi<SellReportRevenueOutputDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        this.apiService().getPaged({
            body: {
                ...prm
            }
        }, {}).then(res => {
            this.summaryData = res;
        })
    }

    getListColumnNameExcel(): string[] {
        return [
            'order',
            'invoiceCode',
            'invoiceDate',
            'partnerName',
            "totalAmount",
            "totalCostAmount",
            "totalProfit"
        ]
    }

    protected getOtherFields(): string[] {
        return [
            'order',
            'invoiceCode',
            'invoiceDate',
            'partnerName',
            "totalAmount",
            "productCode",
            "productName",
            "lotNumber",
            'lotExpiryDate',
            "costPrice",
            "unitName",
            "totalQty",
            "totalQtyReturn",
            "totalRefund",
            "totalRevenue",
            "totalCostAmount",
            "totalProfit",
            'time',
            'fromDate',
            'toDate'
        ]
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }
}

export default ReportSellProfitStore;
