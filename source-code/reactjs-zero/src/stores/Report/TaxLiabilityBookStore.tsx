
import { ProductionBusinessCostSummaryDto, TaxLiabilityBookSummaryDto } from "@api/index.defs";
import { ProductionBusinessCostBookService } from "@api/ProductionBusinessCostBookService";
import { TaxLiabilityBookService } from "@api/TaxLiabilityBookService";
import {
    CommonListStore,
    ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class TaxLiabilityBookStore extends CommonListStore<
    any
> {
    summaryData: TaxLiabilityBookSummaryDto;
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable,
        });
    }
    getNamespaceLocale(): string {
        return "tax-liability";
    }

    apiService() {
        return {
            getPaged: TaxLiabilityBookService.getPaging,
            exportPagedResult: TaxLiabilityBookService.exportExcelTaxLiability
        } as any;
    }

    loadSummary() {
        const prm = this.searchFormRef?.getFieldsValue() || {};
        TaxLiabilityBookService.summary({
            body: prm,
        }).then((res) => {
            this.summaryData = res;
        });
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [

        ];
    }

    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: "70%",
        };
    }

}

export default TaxLiabilityBookStore;
