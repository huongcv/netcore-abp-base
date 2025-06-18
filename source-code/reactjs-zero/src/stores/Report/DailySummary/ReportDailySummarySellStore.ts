import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    CustomerDebtReportDto,
    ExtensiblePagedResultDtoOfSaleInvoiceReportDto,
    SaleInvoiceReportDto
} from "@api/index.defs";
import {CustomerReportService} from "@api/CustomerReportService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable, observable} from "mobx";
import {SellReportService} from "@api/SellReportService";
import {string} from "yup";
import UiUtils from "@ord-core/utils/ui.utils";
import {l} from "@ord-core/language/lang.utils";
import FileSaver from "file-saver";

class ReportDailySummarySellStore extends CommonListStore<SaleInvoiceReportDto>{
    summaryData: ExtensiblePagedResultDtoOfSaleInvoiceReportDto;
    getNamespaceLocale(): string {
            return "report-daily-summary-sale"
    }
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }
    apiService() {
        return {
            getPaged: SellReportService.getReportSaleInvoice,
        } as CommonCrudApi<SaleInvoiceReportDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }
    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        SellReportService.getReportSaleInvoice({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }


    async exportExcel(){
        UiUtils.setBusy();
        try {
            const prm = this.searchFormRef?.getFieldsValue();
            const otherFieldArr = this.OtherFields();
            const otherFieldObj: any = {}
            if (otherFieldArr) {
                otherFieldArr.forEach(it => {
                    otherFieldObj[it] = l.trans(this.getNamespaceLocale() + "." + it, null);
                });
            }
            const body = {
                ...prm,
                export: {
                    title: l.trans(this.getNamespaceLocale() + '.fileExcel.Title', null),
                    columnNames: this.getListColumnNameExcel().map(it => {
                        if (it.toLowerCase() === 'stt') {
                            return l.transCommon(it, null)
                        }
                        return l.trans(this.getNamespaceLocale() + '.' + it, null)
                    }),
                    otherFields: otherFieldObj
                }
            }
            const resultBlob = await this.export(body);
            const fileName = l.trans(this.getNamespaceLocale() + '.fileExcel.FileName', null);
            FileSaver.saveAs(resultBlob, fileName);
            UiUtils.clearBusy();
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    export(body: any): Promise<any> {

            return SellReportService.exportExcelReportSaleInvoice({
                body: body
            }, {
                responseType: 'blob',
            });

    }

    OtherFields(): string[] {
        return [
            'ReportDate',
            'creationTime', 'invoiceCode',
            'order','total',
            "qtyConvert", "returnTotalAmount"]
    }

    getListColumnNameExcel(): string[] {
        return [];
    }
}

export default ReportDailySummarySellStore;
