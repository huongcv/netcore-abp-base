import { ReportTaxDeclarationDto, SupplierDebtReportDto } from "@api/index.defs";
import { SupplierReportService } from "@api/SupplierReportService";
import { TaxDeclrationService } from "@api/TaxDeclrationService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class TaxDeclrationReportStore extends CommonListStore<ReportTaxDeclarationDto> {
    summaryData: any;

    getNamespaceLocale(): string {
        return "report_tax"
    }

    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }

    apiService() {
        return {
            getPaged: TaxDeclrationService.getPaged,
            createOrUpdate: TaxDeclrationService.createOrUpdate, 
            remove: TaxDeclrationService.remove
        } as CommonCrudApi<ReportTaxDeclarationDto>;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        SupplierReportService.getSummarySupplierDebtReport({
            body: prm
        }).then(res => {
            this.summaryData = res;
        })
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }


    getListColumnNameExcel(): string[] {
        return []
    }
}

export default TaxDeclrationReportStore;
