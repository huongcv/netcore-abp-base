import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    DoctorProfitByBillReportDto,
    DoctorProfitByMoneyReportDto,
    DoctorProfitByProductReportDto
} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";
import {DoctorReportService} from "@api/DoctorReportService";

export type DoctorProfitReportType = 'money' | 'bill' | "product";

class DoctorProfitReportStore extends CommonListStore<DoctorProfitByMoneyReportDto | DoctorProfitByBillReportDto | DoctorProfitByProductReportDto> {
    summaryData: DoctorProfitByMoneyReportDto | DoctorProfitByBillReportDto | DoctorProfitByProductReportDto;

    getNamespaceLocale(): string {
        return "report_doctor-profit"
    }

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        const reportType = this.searchFormRef?.getFieldValue('reportType') as DoctorProfitReportType;
        const reportTypeToUrlMapping: Record<DoctorProfitReportType, any> = {
            money: DoctorReportService.getPagedDoctorProfitByMoney,
            bill: DoctorReportService.getPagedDoctorProfitByBill,
            product: DoctorReportService.getPagedDoctorProfitByProduct,
        };
        const urlApi = reportTypeToUrlMapping[reportType] || reportTypeToUrlMapping['money'];

        const reportTypeToUrlExportMapping: Record<DoctorProfitReportType, any> = {
            money: DoctorReportService.exportDoctorProfitByMoneyReport,
            bill: DoctorReportService.exportDoctorProfitByBillReport,
            product: DoctorReportService.exportDoctorProfitByProductReport,
        };
        const urlApiExport = reportTypeToUrlExportMapping[reportType] || reportTypeToUrlExportMapping['money'];

        return {
            getPaged: urlApi,
            exportPagedResult: urlApiExport
        } as CommonCrudApi<DoctorProfitByMoneyReportDto | DoctorProfitByBillReportDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        const reportType = prm.reportType as DoctorProfitReportType;
        switch (reportType) {
            case "money":
                DoctorReportService.getDoctorProfitSummaryByMoney({
                    body: prm
                }).then(res => {
                    this.summaryData = res;
                })
                break;
            case "bill":
                DoctorReportService.getDoctorProfitSummaryByBill({
                    body: prm
                }).then(res => {
                    this.summaryData = res;
                })
                break;
            case "product":
                DoctorReportService.getDoctorProfitSummaryByProduct({
                    body: prm
                }).then(res => {
                    this.summaryData = res;
                })
                break;

        }

    }

    protected getOtherFields(): string[] {
        const reportType = this.searchFormRef?.getFieldValue('reportType') as DoctorProfitReportType;
        switch (reportType) {
            case "money":
                return [
                    'total',
                    'fromDate', 'toDate',
                    'order',
                    "invoiceDate", "doctorName",
                    "totalAmount", "discountAmount", "returnTotalAmount", "totalReturnDiscount", "subTotalAmount","totalVat",
                    "revenueAmount", "totalCostAmount","totalProfit"
                ]
            case "bill":
                return [
                    'total',
                    'fromDate', 'toDate',
                    'order',
                    "patientName", "customerName", "invoiceCode",
                    "invoiceDate", "doctorName",
                    "totalAmount", "discountAmount", "returnTotalAmount", "totalReturnDiscount", "subTotalAmount","totalVat",
                    "revenueAmount", "totalCostAmount","totalProfit"
                ]
            case "product":
                return [
                    'total',
                    'fromDate', 'toDate',
                    'order',
                    "doctorName", "productCode", "productName", "lotNumber", "unitName", "qty", "price",
                    "totalAmount", "discountAmount", "returnQty", "returnPrice", "returnTotalAmount", "totalReturnDiscount", "subTotalAmount","totalVat",
                    "revenueAmount", "totalCostAmount","totalProfit"
                ]
        }
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default DoctorProfitReportStore;
