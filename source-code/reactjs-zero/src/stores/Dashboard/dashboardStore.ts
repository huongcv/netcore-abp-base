import {
    CustomerComparisonDto,
    GetTopSellByChanelRequest,
    RevenueComparisonDto,
    RevenueDataByChanelDto,
    RevenueDataInMonthDto,
    SaleInvoiceComparisonDto,
    WarningExpiryProductDto
} from "@api/index.defs";
import {action, makeObservable, observable} from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";
import {DashboardService} from "@api/DashboardService";
import {l} from "@ord-core/language/lang.utils";
import FileSaver from "file-saver";

class DashboardStored {
    warningData: WarningExpiryProductDto | undefined;
    saleInvoiceData: SaleInvoiceComparisonDto | undefined;
    revenueData: RevenueComparisonDto | undefined;
    revenueInMonth: RevenueDataInMonthDto | undefined;
    customerData: CustomerComparisonDto | undefined;
    revenueChanelData: RevenueDataByChanelDto[] | undefined;
    revenueChanelGroupData: RevenueDataByChanelDto[] | undefined;

    constructor() {
        this.warningData = {
            countWarningExpiry: 0,
            countExpiried: 0,
            countOutOfStock: 0,
        }

        makeObservable(this, {
            warningData: observable,
            saleInvoiceData: observable,
            revenueData: observable,
            revenueInMonth: observable,
            customerData: observable,
            revenueChanelData: observable,
            revenueChanelGroupData: observable,
            getCountStatusProduct: action,
            getSaleInvoiceByDays: action,
            getRevenueByDays: action,
            getDataRevenueInMonth: action,
            getRevenueByChanel: action,
            getRevenueByChanelGroup: action,
            getCustomerByDays: action
        });
    }



    getNamespaceLocale(): string {
        return "dashboard"
    }

    async getCountStatusProduct() {
        UiUtils.setBusy();
        try {
            const response = await DashboardService.getWarningExpiryProduct();
            this.warningData = response.data;
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    async getSaleInvoiceByDays() {
        UiUtils.setBusy();
        try {
            const response = await DashboardService.getSaleInvoiceByDays();
            this.saleInvoiceData = response.data
        } catch (error) {

        } finally {
            UiUtils.clearBusy();
        }
    }

    async getRevenueByDays() {
        UiUtils.setBusy();
        try {
            const response = await DashboardService.getRevenueByDays();
            this.revenueData = response.data
        } catch (error) {

        } finally {
            UiUtils.clearBusy();
        }
    }

    async getCustomerByDays() {
        UiUtils.setBusy();
        try {
            const response = await DashboardService.getCustomerTotalPurchase();
            this.customerData = response.data
        } catch (error) {

        } finally {
            UiUtils.clearBusy();
        }
    }

    async getRevenueByChanel(body:GetTopSellByChanelRequest) {

        try {
            const response = await DashboardService.getDataRevenueByChanel({body:body});
            this.revenueChanelData = response.data
        } catch (error) {

        }
    }
    async getRevenueByChanelGroup(body:GetTopSellByChanelRequest) {

        try {
            const response = await DashboardService.getDataRevenueByChanelGroup({body:body});
            this.revenueChanelGroupData = response.data
        } catch (error) {

        }
    }

    async getDataRevenueInMonth() {
        UiUtils.setBusy();
        try {
            const response = await DashboardService.getDataRevenueInMonth();
            this.revenueInMonth = response.data
        } catch (error) {

        } finally {
            UiUtils.clearBusy();
        }
    }


    async exportProductOutOfStock() {
        UiUtils.setBusy();
        try {
            const fieldInSapHetHan = [
                'order',
                "productCode",
                "productName", "basicUnitName", "qty"];
            const otherFieldObj: any = {}
            fieldInSapHetHan.forEach(it => {
                otherFieldObj[it] = l.trans(this.getNamespaceLocale() + "." + it, null);
            });
            DashboardService.exportProductOutOfStock({
                    body: {
                        export: {
                            title: l.trans(this.getNamespaceLocale() + '.dsSapHetHang', null),
                            otherFields: otherFieldObj
                        },
                    }},
                {
                    responseType: 'blob'
                }
            ).then(res => {
                const fileName = l.trans(this.getNamespaceLocale() + '.fileExcel.sapHetHang', null);
                FileSaver.saveAs(res, fileName);
            })

        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    }


}

export default DashboardStored;
