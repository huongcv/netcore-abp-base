import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CustomerRevenueReportDto, SupplierProductReportDto} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SupplierReportService} from "@api/SupplierReportService";
import {EmployeeReportService} from "@api/EmployeeReportService";
import {action, makeObservable, observable} from "mobx";
import {FinancialReportService} from "@api/FinancialReportService";
import {l} from "@ord-core/language/lang.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import {FormInstance} from "antd";

export interface FinancialReportData {
    key: React.ReactNode;
    order: string,
    name: string;
    formula?: string;
    totalAmount: number;
    children?: FinancialReportData[];
}

class FinancialReportStore {
    dataSource: FinancialReportData[] = [];

    getNamespaceLocale(): string {
        return "report_financial"
    }

    constructor() {
        // super();
        makeObservable(this, {
            dataSource: observable,
            searchFormRef: observable,
            setSearchFormRef: action,
        })
    }

    searchFormRef: FormInstance | undefined;

    setSearchFormRef(searchFormRef: FormInstance) {
        this.searchFormRef = searchFormRef;
    }

    apiService() {
        return {} as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    loadReport(param?: any) {
        const tran = (fieldName: string) => {
            return l.trans(this.getNamespaceLocale() + '.' + fieldName, null)
        }
        const prm = param || this.searchFormRef?.getFieldsValue() || {};
        FinancialReportService.getDebtFinance({
            body: {
                ...prm
            }
        }).then(result => {
            if (result.isSuccessful) {
                const res = result.data ?? {};
                this.dataSource = [
                    {
                        order: "I",
                        name: tran('grossProfit'),
                        formula: "I= (6)",
                        key: "I",
                        totalAmount: res.grossProfit ?? 0,
                        children: [
                            {
                                order: "1",
                                name: tran('totalRevenue'),
                                totalAmount: res.revenue ?? 0,
                                key: 'I.1'
                            },
                            {
                                order: "2",
                                name: tran('totalReturnAmount'),
                                totalAmount: res.totalReturnAmount ?? 0,
                                key: 'I.2'
                            },
                            {
                                order: "3",
                                name: tran('totalAmountForCancel'),
                                totalAmount: res.totalAmountForCancel ?? 0,
                                key: 'I.3'
                            },
                            {
                                order: "4",
                                name: tran('totalAmountForOtherGoods'),
                                totalAmount: res.totalAmountForOtherGoods ?? 0,
                                key: 'I.4'
                            },
                            {
                                order: "5",
                                name: tran('totalCost'),
                                totalAmount: res.costOfGoodSold ?? 0,
                                key: 'I.5'
                            },
                            {
                                order: "6",
                                name: tran('grossProfit'),
                                totalAmount: res.grossProfit ?? 0,
                                formula: '6 = (1 - 2 - 3 - 4 - 5)',
                                key: 'I.6'
                            },
                        ]
                    },
                    {
                        order: "II",
                        name: tran('revenueAndExpenditure'),
                        formula: "II= (1-2)",
                        key: "II",
                        totalAmount: res.revenueAndExpenditure ?? 0,
                        children: [
                            {
                                order: "1",
                                name: tran('totalReceipts'),
                                key: "II.1",
                                totalAmount: res.otherIncome ?? 0,
                            },
                            {
                                order: "2",
                                name: tran('totalPaymentVoucher'),
                                key: "II.2",
                                totalAmount: res.operatingExpense ?? 0,
                            }
                        ]
                    },
                    {
                        order: "III",
                        name: tran('profit'),
                        formula: "III= (1)",
                        key: "III",
                        totalAmount: res.netProfit ?? 0,
                        children: [
                            {
                                order: "1",
                                name: tran('profit'),
                                key: "III.1",
                                formula: "1 = (I + II)",
                                totalAmount: res.netProfit ?? 0,
                            },
                        ]
                    },

                ];
            }else{
                UiUtils.showError(result.message);
            }

        }, () => {
            UiUtils.showError("errorConnectServer");
        })
        // SupplierReportService.getSumarySupplierImport({
        //     body: prm
        // }).then(res => {
        //     this.summaryData = res;
        // })
    }

    protected getOtherFields(): string[] {
        return [
            'fromDate', 'toDate',
            'order', "totalAmount", "formula",
            "name"
        ]
    }

    public async exportExcelPagedResultExt() {
        UiUtils.setBusy();
        try {

            const otherFieldArr = this.getOtherFields();
            const otherFieldObj: any = {}
            if (otherFieldArr) {
                otherFieldArr.forEach(it => {
                    otherFieldObj[it] = l.trans(this.getNamespaceLocale() + "." + it, null);
                });
            }

            const resultBlob = await FinancialReportService.exportExcelFinancial({
                body: {
                    ...this.searchFormRef?.getFieldsValue(),
                    dataSource: this.dataSource,
                    export: {
                        title: l.trans(this.getNamespaceLocale() + '.fileExcel.Title', null),
                        otherFields: otherFieldObj,
                    }
                }
            }, {
                responseType: 'blob',
            });
            const fileName = l.trans(this.getNamespaceLocale() + '.fileExcel.FileName', null);
            FileSaver.saveAs(resultBlob, fileName);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default FinancialReportStore;
