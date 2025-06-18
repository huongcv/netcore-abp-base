import {PharmacyLogReportControlledDrugStockOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";

class PharmacyLogControlledDrugStockReportStore extends CommonListStore<PharmacyLogReportControlledDrugStockOutputDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_PharmacyLogControlledDrugStock"
    }

    apiService() {
        return {
            getPaged: PharmacyLogService.getDataPaggingControlledDrugStock,
            exportPagedResult: PharmacyLogService.exportDataToExcelControlledDrugStock
        } as CommonCrudApi<PharmacyLogReportControlledDrugStockOutputDto>;
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
            "productCode", "productName",
            "lotNumber", "basicUnitName",
            "beginningBalanceQty", "importQty", "errorLoss", "shrinkage", "exportQty", "endingBalanceQty", "qty"
        ]
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogControlledDrugStockReportStore;
