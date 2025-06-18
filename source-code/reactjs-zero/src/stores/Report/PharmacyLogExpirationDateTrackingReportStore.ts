import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";
import {PharmacyLogReportExpirationDateTrackingOutputDto} from "@api/index.defs";

class PharmacyLogExpirationDateTrackingReportStore extends CommonListStore<PharmacyLogReportExpirationDateTrackingOutputDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_PharmacyLogExpirationDateTracking"
    }

    apiService() {
        return {
            getPaged: PharmacyLogService.getDataPaggingExpirationDateTracking,
            exportPagedResult: PharmacyLogService.exportDataToExcelExpirationDateTracking
        } as CommonCrudApi<PharmacyLogReportExpirationDateTrackingOutputDto>;
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
            "year",
            "productCode", "productName",
            "lotNumber", "basicUnitName", "qty",
            "expiryInYear",
        ]
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogExpirationDateTrackingReportStore;
