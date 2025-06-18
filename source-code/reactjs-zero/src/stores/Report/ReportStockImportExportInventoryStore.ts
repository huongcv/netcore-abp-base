import {SellReportRevenueOutputDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import { StockInventoryReportService } from "@api/StockInventoryReportService";

class ReportStockImportExportInventoryStore extends CommonListStore<SellReportRevenueOutputDto, SellReportRevenueOutputDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_stockImportExportInventory"
    }

    apiService() {
        return {
            getPaged: StockInventoryReportService.transaction,
            exportPagedResult: StockInventoryReportService.exportTransaction
        } as CommonCrudApi<SellReportRevenueOutputDto>;
    }


    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [
            'total',
            'fromDate', 'toDate',
            'isActived',
            'order',
            "inventoryId",
            "productCode",
            "productName","basicUnitName",
            "beginningBalance", "import", 
            "export", "endingBalance", "value", 
            "qty", "qtyCurrent", "customerReturn",
            "check"
        ]
    }

    getInitModal(): ICreateOrUpdateModal<SellReportRevenueOutputDto> {
        return {
            width: '70%'
        };
    }

    override async beforeSaveEntity(input: SellReportRevenueOutputDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default ReportStockImportExportInventoryStore;
