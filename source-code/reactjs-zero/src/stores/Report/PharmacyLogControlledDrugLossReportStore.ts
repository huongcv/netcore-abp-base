import {PharmacyLogReportControlledDrugStockOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";

class PharmacyLogControlledDrugLossReportStore extends CommonListStore<PharmacyLogReportControlledDrugStockOutputDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_PharmacyLogControlledDrugLoss"
    }

    apiService() {
        return {
            getPaged: PharmacyLogService.getDataPaggingControlledDrugLoss,
            exportPagedResult: PharmacyLogService.exportDataToExcelControlledDrugLoss
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
            "errorLoss", "note"
        ]
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogControlledDrugLossReportStore;
