import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    CustomerRevenueReportDto,
    DoctorRevenueByBillReportDto,
    DoctorRevenueByMoneyReportDto, DoctorRevenueByProductReportDto,
    EmployeeRevenueReportDto
} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {EmployeeReportService} from "@api/EmployeeReportService";
import {CustomerReportService} from "@api/CustomerReportService";
import {makeObservable, observable} from "mobx";
import {DoctorReportService} from "@api/DoctorReportService";
import {SellReportService} from "@api/SellReportService";

export type DoctorRevenueReportType = 'money' | 'bill' | "product";

class DoctorRevenueReportStore extends CommonListStore<DoctorRevenueByMoneyReportDto | DoctorRevenueByBillReportDto| DoctorRevenueByProductReportDto> {
    summaryData: DoctorRevenueByMoneyReportDto | DoctorRevenueByBillReportDto| DoctorRevenueByProductReportDto;

    getNamespaceLocale(): string {
        return "report_doctor-revenue"
    }

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        const reportType = this.searchFormRef?.getFieldValue('reportType') as DoctorRevenueReportType;
        console.log("reportType", reportType)
        const reportTypeToUrlMapping: Record<DoctorRevenueReportType, any> = {
            money: DoctorReportService.getPagedDoctorRevenueByMoney,
            bill: DoctorReportService.getPagedDoctorRevenueByBill,
            product: DoctorReportService.getPagedDoctorRevenueByProduct,
        };
        const urlApi = reportTypeToUrlMapping[reportType] || reportTypeToUrlMapping['money'];

        const reportTypeToUrlExportMapping: Record<DoctorRevenueReportType, any> = {
            money: DoctorReportService.exportDoctorRevenueByMoneyReport,
            bill: DoctorReportService.exportDoctorRevenueByBillReport,
            product: DoctorReportService.exportDoctorRevenueByProductReport,
        };
        const urlApiExport = reportTypeToUrlExportMapping[reportType] || reportTypeToUrlExportMapping['money'];

        return {
            getPaged: urlApi,
            exportPagedResult: urlApiExport
        } as CommonCrudApi<DoctorRevenueByMoneyReportDto| DoctorRevenueByBillReportDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        const reportType = prm.reportType as DoctorRevenueReportType;
        switch (reportType) {
            case "money":
                DoctorReportService.getDoctorRevenueSummaryByMoney({
                    body: prm
                }).then(res => {
                    this.summaryData = res;
                })
                break;
            case "bill":
                DoctorReportService.getDoctorRevenueSummaryByBill({
                    body: prm
                }).then(res => {
                    this.summaryData = res;
                })
                break;
            case "product":
                DoctorReportService.getDoctorRevenueSummaryByProduct({
                    body: prm
                }).then(res => {
                    this.summaryData = res;
                })
                break;

        }

    }

    protected getOtherFields(): string[] {
        const reportType = this.searchFormRef?.getFieldValue('reportType') as DoctorRevenueReportType;
        switch (reportType) {
            case "money":
                return [
                    'total',
                    'fromDate', 'toDate',
                    'order',
                    "invoiceDate", "doctorName",
                    "totalAmount", "discountAmount", "returnTotalAmount", "totalReturnDiscount", "subTotalAmount","totalVat",
                    "revenueAmount"
                ]
            case "bill":
                return [
                    'total',
                    'fromDate', 'toDate',
                    'order',
                    "patientName","customerName","invoiceCode",
                    "invoiceDate", "doctorName",
                    "totalAmount", "discountAmount", "returnTotalAmount", "totalReturnDiscount","subTotalAmount","totalVat",
                    "revenueAmount"
                ]
            case "product":
                return [
                    'total',
                    'fromDate', 'toDate',
                    'order',
                    "doctorName","productCode","productName","lotNumber","unitName","qty","price",
                    "totalAmount", "discountAmount", "returnQty","returnPrice", "returnTotalAmount", "totalReturnDiscount","subTotalAmount","totalVat",
                    "revenueAmount"
                ]
        }
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default DoctorRevenueReportStore;
