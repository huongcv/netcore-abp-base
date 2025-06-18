import {PharmacyLogReportDrugStockInOutOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";

class PharmacyLogDrugStockInOutReportStore extends CommonListStore<PharmacyLogReportDrugStockInOutOutputDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_PharmacyLogDrugStockInOut"
    }

    apiService() {
        return {
            getPaged: PharmacyLogService.getDataPaggingDrugStockInOut,
            exportPagedResult: PharmacyLogService.exportDataToExcelDrugStockInOut
        } as CommonCrudApi<PharmacyLogReportDrugStockInOutOutputDto>;
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
            "moveDate",
            "expiryDate",
            "productCode","productName",
            "lotNumber", "basicUnitName",
            "beginningBalanceQty", "importQty", "inventoryCheckQty", "exportQty", "endingBalanceQty", "qty",
            "returnsQty"
        ]
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogDrugStockInOutReportStore;
